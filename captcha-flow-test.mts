import { createHash } from "node:crypto";
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const target = pathToFileURL(resolve(process.cwd(), `${specifier.slice(2)}.ts`)).href;
      return nextResolve(target, context);
    }
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (specifier.startsWith("./") || specifier.startsWith("../")) {
        return nextResolve(`${specifier}.ts`, context);
      }
      throw error;
    }
  },
});

const { createCaptchaChallenge, verifyCaptchaAnswer, isAttemptRateLimited, isGenerationRateLimited } =
  await import("./server/services/captcha.service.ts");
const { prisma } = await import("./server/config/prisma.ts");

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  (got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)})`}`);
}

function pepper(): string {
  return process.env.COMMENT_IP_PEPPER ?? "taekyar-comment-ip-pepper";
}

function normalizeDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
}

function hashAnswer(answer: string, captchaId: string): string {
  return createHash("sha256")
    .update(`${normalizeDigits(answer.trim())}${captchaId}${pepper()}`)
    .digest("hex");
}

function bruteForceAnswer(challengeId: string, answerHash: string): string | null {
  for (let digits = 4; digits <= 5; digits += 1) {
    for (let value = 0; value < 10 ** digits; value += 1) {
      const candidate = String(value).padStart(digits, "0");
      if (hashAnswer(candidate, challengeId) === answerHash) return candidate;
    }
  }
  return null;
}

async function issueWithAnswer(sessionToken: string, ipHash: string | null) {
  const challenge = await createCaptchaChallenge({ sessionToken, ipHash });
  const row = await prisma.captchaChallenge.findUnique({ where: { sessionToken } });
  if (!row || row.challengeId !== challenge.id) return null;
  return bruteForceAnswer(row.challengeId, row.answerHash);
}

async function cleanup() {
  await prisma.captchaChallenge.deleteMany({});
  await prisma.rateLimitCounter.deleteMany({});
}

const IP_A = "1.2.3.4-hash";
const IP_B = "5.6.7.8-hash";

try {
  await cleanup();

  const first = await createCaptchaChallenge({ sessionToken: "token-a", ipHash: IP_A });
  check("svg generated", first.svg.startsWith("<svg") && first.svg.includes("</svg>"), true);
  check("challenge id returned", typeof first.id === "string" && first.id.length > 10, true);
  check("svg does not contain challenge id", first.svg.includes(first.id), false);

  const second = await createCaptchaChallenge({ sessionToken: "token-a", ipHash: IP_A });
  check("refresh overwrites challenge", second.id !== first.id, true);
  const rowCount = await prisma.captchaChallenge.count({ where: { sessionToken: "token-a" } });
  check("single row per session token", rowCount, 1);

  const stored = await prisma.captchaChallenge.findUnique({ where: { sessionToken: "token-a" } });
  check("row stores ip hash", stored?.ipHash, IP_A);
  check("expiresAt in future", (stored?.expiresAt.getTime() ?? 0) > Date.now(), true);
  const solved = stored ? bruteForceAnswer(stored.challengeId, stored.answerHash) : null;
  check("answer brute-forceable in test", typeof solved === "string", true);

  const wrongAnswer = solved === "0000" ? "9999" : "0000";
  check("wrong answer rejected", await verifyCaptchaAnswer({ sessionToken: "token-a", answer: wrongAnswer, ipHash: IP_A }), "wrong");
  check("wrong answer burns challenge", await verifyCaptchaAnswer({ sessionToken: "token-a", answer: solved ?? "1234", ipHash: IP_A }), "expired");

  const ipBoundAnswer = await issueWithAnswer("token-ip", IP_A);
  if (ipBoundAnswer) {
    check("wrong ip binding rejected", await verifyCaptchaAnswer({ sessionToken: "token-ip", answer: ipBoundAnswer, ipHash: IP_B }), "expired");
  } else {
    check("issue with answer (ip binding)", false, true);
  }

  const correctAnswer = await issueWithAnswer("token-ok", IP_A);
  if (correctAnswer) {
    check("correct answer ok", await verifyCaptchaAnswer({ sessionToken: "token-ok", answer: correctAnswer, ipHash: IP_A }), "ok");
    check("replay blocked (single-use)", await verifyCaptchaAnswer({ sessionToken: "token-ok", answer: correctAnswer, ipHash: IP_A }), "expired");
  } else {
    check("issue with answer (correct)", false, true);
  }

  const persianAnswer = await issueWithAnswer("token-fa", IP_A);
  if (persianAnswer) {
    const persianDigits = persianAnswer.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
    check("persian digit answer accepted", await verifyCaptchaAnswer({ sessionToken: "token-fa", answer: persianDigits, ipHash: IP_A }), "ok");
  } else {
    check("issue with answer (persian)", false, true);
  }

  await createCaptchaChallenge({ sessionToken: "token-malformed", ipHash: IP_A });
  check("malformed answer wrong", await verifyCaptchaAnswer({ sessionToken: "token-malformed", answer: "abc!", ipHash: IP_A }), "wrong");
  check("missing session token expired", await verifyCaptchaAnswer({ sessionToken: null, answer: "1234", ipHash: IP_A }), "expired");
  check("unknown session token expired", await verifyCaptchaAnswer({ sessionToken: "nope", answer: "1234", ipHash: IP_A }), "expired");

  const concurrentAnswer = await issueWithAnswer("token-concurrent", IP_A);
  if (concurrentAnswer) {
    const results = await Promise.all([
      verifyCaptchaAnswer({ sessionToken: "token-concurrent", answer: concurrentAnswer, ipHash: IP_A }),
      verifyCaptchaAnswer({ sessionToken: "token-concurrent", answer: concurrentAnswer, ipHash: IP_A }),
      verifyCaptchaAnswer({ sessionToken: "token-concurrent", answer: concurrentAnswer, ipHash: IP_A }),
    ]);
    check("concurrent verify: exactly one ok", results.filter((result) => result === "ok").length, 1);
  } else {
    check("issue with answer (concurrent)", false, true);
  }

  await createCaptchaChallenge({ sessionToken: "token-expired", ipHash: IP_A });
  await prisma.captchaChallenge.update({
    where: { sessionToken: "token-expired" },
    data: { expiresAt: new Date(Date.now() - 1000) },
  });
  check("expired challenge rejected", await verifyCaptchaAnswer({ sessionToken: "token-expired", answer: "1234", ipHash: IP_A }), "expired");

  await createCaptchaChallenge({ sessionToken: "cleanup-probe", ipHash: IP_A });
  const expiredLeft = await prisma.captchaChallenge.count({ where: { sessionToken: "token-expired" } });
  check("expired rows pruned on issuance", expiredLeft, 0);

  await prisma.rateLimitCounter.deleteMany({});
  const attemptResults: boolean[] = [];
  for (let index = 0; index < 6; index += 1) {
    attemptResults.push(await isAttemptRateLimited(IP_A));
  }
  check("attempt limit trips on 5th", JSON.stringify(attemptResults), JSON.stringify([false, false, false, false, true, true]));
  check("attempt limit is per ip", await isAttemptRateLimited(IP_B), false);

  await prisma.rateLimitCounter.deleteMany({});
  const generationResults: boolean[] = [];
  for (let index = 0; index < 21; index += 1) {
    generationResults.push(await isGenerationRateLimited(IP_A));
  }
  check("generation limit trips on 21st", generationResults.filter(Boolean).length, 1);
} finally {
  await cleanup();
  await prisma.$disconnect();
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);

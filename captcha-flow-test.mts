import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
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

const { createCaptchaChallenge, createCaptchaSessionToken, hashCaptchaAnswer, verifyCaptchaAnswer } = await import(
  "./lib/captcha.ts"
);
const { redis } = await import("./lib/redis.ts");

const FA = "۰۱۲۳۴۵۶۷۸۹";
const ANSWER_FA = "۷۳۹۴";
const ANSWER_LATIN = ANSWER_FA.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)));

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
}

const IP_A = "hash-a";
const IP_B = "hash-b";
const TTL_SECONDS = 2;

const freshSession = (): string => createCaptchaSessionToken();

async function mint(sessionToken: string, ipHash: string | null = IP_A) {
  return createCaptchaChallenge({ sessionToken, ipHash, ttlSeconds: TTL_SECONDS });
}

async function verify(sessionToken: string | null, answer: string, ipHash: string | null = IP_A) {
  return verifyCaptchaAnswer({ sessionToken, answer, ipHash });
}

/* ---------------------------------------------------------- svg output */
{
  const session = freshSession();
  const { svg } = await mint(session);
check("output is svg", svg.startsWith("<svg"), true);
check("svg is non-trivial", svg.length >= 3000, true);
check("svg contains character paths", svg.includes("<path"), true);
check("plaintext answer not embedded in svg", svg.includes(ANSWER_FA) || svg.includes(ANSWER_LATIN), false);
}

/* ----------------------------------------------- every request is unique */
{
  const session = freshSession();
  const a = await mint(session);
  const b = await mint(session);
  check("two requests yield different ids", a.id === b.id, false);
}

/* ------------------------------------------------------------- overwrite */
{
  const session = freshSession();
  const first = await mint(session);
  let second = await mint(session);
  while (second.text === first.text) {
    second = await mint(session);
  }
  check("previous challenge replaced by refresh", await verify(session, first.text), "wrong");
}

/* ------------------------------------------------------------ happy path */
{
  const session = freshSession();
  const { text } = await mint(session);
  check("correct persian answer accepted", await verify(session, text), "ok");
  check("reusing solved captcha rejected (expired)", await verify(session, text), "expired");
}
{
  const session = freshSession();
  const { text } = await mint(session);
  check("english digits accepted", await verify(session, text.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)))), "ok");
}

/* --------------------------------------------------------------- expiry */
{
  const session = freshSession();
  const { text } = await mint(session);
  await new Promise((resolve) => setTimeout(resolve, TTL_SECONDS * 1000 + 200));
  check("expired captcha rejected", await verify(session, text), "expired");
}

/* ------------------------------------------------------ session binding */
{
  const mine = freshSession();
  const theirs = freshSession();
  const { text } = await mint(theirs);
  check("challenge not usable from another session", await verify(mine, text), "expired");
  check("challenge usable from its own session", await verify(theirs, text), "ok");
}

/* ----------------------------------------------------------- ip binding */
{
  const session = freshSession();
  const { text } = await mint(session, IP_A);
  check("different ip rejected", await verify(session, text, IP_B), "expired");
  const { text: text2 } = await mint(session, IP_A);
  check("same ip accepted", await verify(session, text2, IP_A), "ok");
}

/* ------------------------------------- malformed input burns challenge */
{
  const session = freshSession();
  const { text } = await mint(session);
  check("non-numeric answer -> wrong", await verify(session, "abcd"), "wrong");
  check("challenge consumed after wrong answer", await verify(session, text), "expired");
}
{
  const session = freshSession();
  const { text } = await mint(session);
  check("too-short answer -> wrong", await verify(session, "۱۲"), "wrong");
  check("challenge consumed after too-short answer", await verify(session, text), "expired");
}

/* ------------------------------------------------------ missing session */
check("null session -> expired", await verify(null, ANSWER_FA), "expired");
check("unknown session -> expired", await verify(freshSession(), ANSWER_FA), "expired");

/* ------------------------------------------------------------- hashing */
check(
  "hash persian == hash latin",
  hashCaptchaAnswer(ANSWER_FA, "some-id") === hashCaptchaAnswer(ANSWER_LATIN, "some-id"),
  true,
);
check(
  "answer hash is salted with challenge id",
  hashCaptchaAnswer(ANSWER_FA, "id-1") === hashCaptchaAnswer(ANSWER_FA, "id-2"),
  false,
);

await redis.quit();
console.log(failures === 0 ? "ALL TESTS PASSED" : `${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);

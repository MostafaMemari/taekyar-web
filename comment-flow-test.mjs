const BASE = "http://localhost:3100";

let failures = 0;
function check(name, condition) {
  const ok = Boolean(condition);
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
}

async function attempt(ip, testCase) {
  const response = await fetch(`${BASE}/api/comment-flow-test`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({ testCase }),
  });
  return response.json();
}

const r1 = await attempt("10.0.0.1", "correct");
check("real submission with solved captcha succeeds", r1.ok === true && r1.reason === undefined);
check("hashed ip stored on the comment (prisma ipHash works)", r1.ipHashStored === true);

const r2 = await attempt("10.0.0.2", "wrong-captcha");
check("submission with wrong captcha rejected", r2.ok === false && r2.reason === "captcha");

const r3 = await attempt("10.0.0.3", "honeypot");
check("honeypot submission rejected", r3.ok === false && r3.reason === "validation");

const phase4 = [];
for (let i = 0; i < 4; i += 1) phase4.push(await attempt("10.0.0.4", "correct"));
check("db limiter: first three submissions succeed", phase4.slice(0, 3).every((r) => r.ok === true));
check("db limiter: fourth submission rate-limited (3 per 10 min per post+ip)", phase4[3].ok === false && phase4[3].reason === "rate_limited");

const phase5 = [];
for (let i = 0; i < 5; i += 1) phase5.push(await attempt("10.0.0.5", "wrong-captcha"));
check("attempt limiter: first four failed attempts rejected as captcha", phase5.slice(0, 4).every((r) => r.ok === false && r.reason === "captcha"));
check("attempt limiter: fifth attempt rate-limited (4 per 10 min per ip)", phase5[4].ok === false && phase5[4].reason === "rate_limited");

const cleanup = await attempt("10.0.0.1", "cleanup");
check("test comments cleaned up from database", cleanup.deleted >= 5);

console.log(failures === 0 ? "ALL FLOW TESTS PASSED" : `${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
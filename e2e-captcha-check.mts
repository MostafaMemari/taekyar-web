import { createHash } from "node:crypto";
import Redis from "ioredis";

const BASE_A = "http://localhost:3100";
const BASE_B = "http://localhost:3101";
const FA = "۰۱۲۳۴۵۶۷۸۹";
const PEPPER = process.env.COMMENT_IP_PEPPER ?? "taekyar-comment-ip-pepper";

const redis = new Redis(process.env.REDIS_URL);

function extractActionFields(html: string) {
  const decode = (s: string) => s.replaceAll("&quot;", '"').replaceAll("&amp;", "&");
  const ref = html.match(/name="\$ACTION_REF_1"/);
  const bound = html.match(/name="\$ACTION_1:0" value="([^"]*)"/);
  const args = html.match(/name="\$ACTION_1:1" value="([^"]*)"/);
  const key = html.match(/name="\$ACTION_KEY" value="([^"]*)"/);
  if (!ref || !bound || !args || !key) throw new Error("action fields not found");
  return { "$ACTION_REF_1": "", "$ACTION_1:0": decode(bound[1]), "$ACTION_1:1": decode(args[1]), "$ACTION_KEY": key[1] };
}

async function fetchCaptcha(base: string) {
  const res = await fetch(`${base}/api/captcha/image`);
  if (!res.ok) throw new Error(`captcha fetch failed: ${res.status}`);
  const cookie = res.headers.getSetCookie().find((c) => c.startsWith("tc_captcha="));
  const contentType = res.headers.get("content-type");
  const svg = await res.text();
  return { sessionToken: decodeURIComponent(cookie.split(";")[0].split("=")[1]), contentType, svg };
}

async function solveFromRedis(sessionToken: string): Promise<string> {
  const raw = await redis.get(`captcha:challenge:${sessionToken}`);
  if (!raw) throw new Error("challenge not in redis");
  const { id, answerHash } = JSON.parse(raw) as { id: string; answerHash: string };
  const target = (latin: string) => createHash("sha256").update(`${latin}${id}${PEPPER}`).digest("hex");
  for (let len = 4; len <= 5; len += 1) {
    for (let n = 0; n < 10 ** len; n += 1) {
      const latin = String(n).padStart(len, "0");
      if (target(latin) === answerHash) {
        return latin.split("").map((d) => FA[Number(d)]).join("");
      }
    }
  }
  throw new Error("answer not found");
}

async function submitLogin(base: string, sessionToken: string, answer: string) {
  const form = new FormData();
  const fields = extractActionFields(await (await fetch(`${base}/login`)).text());
  for (const [k, v] of Object.entries(fields)) form.append(k, v);
  form.append("username", process.env.ADMIN_USERNAME);
  form.append("password", process.env.ADMIN_PASSWORD);
  form.append("captchaAnswer", answer);
  const res = await fetch(`${base}/login`, {
    method: "POST",
    redirect: "manual",
    headers: { Cookie: `tc_captcha=${encodeURIComponent(sessionToken)}` },
    body: form,
  });
  const html = await res.text();
  return {
    status: res.status,
    redirected: res.status >= 300 && res.status < 400,
    location: res.headers.get("location"),
    captchaError: html.includes("کد امنیتی"),
    invalidCreds: html.includes("نام کاربری یا گذرواژه"),
  };
}

console.log("1) image A -> content-type:", (await fetchCaptcha(BASE_A)).contentType);

const wrong = await fetchCaptcha(BASE_A);
const wrongResult = await submitLogin(BASE_B, wrong.sessionToken, "۱۱۱۱");
console.log("2) cross-instance WRONG answer  ->", JSON.stringify(wrongResult));

const good = await fetchCaptcha(BASE_A);
const answer = await solveFromRedis(good.sessionToken);
console.log("3) solved answer from redis:", answer);
const goodResult = await submitLogin(BASE_B, good.sessionToken, answer);
console.log("4) cross-instance CORRECT answer ->", JSON.stringify(goodResult));

await redis.quit();
process.exit(goodResult.redirected ? 0 : 1);

import { createCaptchaChallenge, getCaptchaImage, verifyCaptchaAnswer, hashCaptchaAnswer } from "./lib/comment-captcha.ts";

const FA = "۰۱۲۳۴۵۶۷۸۹";
const DIGITS = ["۷", "۳", "۹", "۴"];
const ANSWER_FA = DIGITS.join("");
const ANSWER_LATIN = ANSWER_FA.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)));

let failures = 0;
function check(name, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
}

function pngSignature(buffer) {
  return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
}

const IP_A = "hash-a";
const IP_B = "hash-b";
const FAR_FUTURE = Date.now() + 6 * 60 * 1000;

// 1. real raster image, no SVG/text
const c1 = createCaptchaChallenge(IP_A, DIGITS);
const img1 = getCaptchaImage(c1.id);
check("image route returns a buffer", img1 !== null, true);
check("content type is image/png", img1.contentType, "image/png");
check("buffer is a valid PNG (signature)", pngSignature(img1.buffer), true);
check("png is non-trivial (>=1KB)", img1.buffer.length >= 1000, true);

// 2. image bytes contain neither the digits nor <text>/svg
const ascii = img1.buffer.toString("latin1");
check("no svg/text markup in image bytes", ascii.includes("<text") || ascii.includes("<svg"), false);
check("plaintext digits not embedded in image bytes", ascii.includes(ANSWER_FA) || ascii.includes(ANSWER_LATIN), false);

// 3. unknown id -> no image
check("unknown id yields null image", getCaptchaImage("nope"), null);

// 4. correct persian answer -> ok
check("correct persian answer accepted", verifyCaptchaAnswer(c1.id, ANSWER_FA, IP_A), "ok");

// 5. single-use: reusing consumed challenge -> expired
check("reusing solved captcha rejected (expired)", verifyCaptchaAnswer(c1.id, ANSWER_FA, IP_A), "expired");

// 6. wrong answer -> wrong (fresh)
const c2 = createCaptchaChallenge(IP_A, DIGITS);
check("wrong answer -> wrong", verifyCaptchaAnswer(c2.id, "۱۱۱۱", IP_A), "wrong");

// 7. wrong answer consumed the challenge
check("wrong answer consumed challenge", verifyCaptchaAnswer(c2.id, ANSWER_FA, IP_A), "expired");

// 8. expired (inject far-future now)
const c3 = createCaptchaChallenge(IP_A, DIGITS);
check("expired captcha rejected", verifyCaptchaAnswer(c3.id, ANSWER_FA, IP_A, FAR_FUTURE), "expired");

// 9. english digits accepted
const c4 = createCaptchaChallenge(IP_A, DIGITS);
check("english digits accepted", verifyCaptchaAnswer(c4.id, ANSWER_LATIN, IP_A), "ok");

// 10. ip binding
const c5 = createCaptchaChallenge(IP_A, DIGITS);
check("different ip rejected", verifyCaptchaAnswer(c5.id, ANSWER_FA, IP_B), "expired");

// 11. length guards
const c6 = createCaptchaChallenge(IP_A, DIGITS);
check("too-short answer -> wrong", verifyCaptchaAnswer(c6.id, "۱۲", IP_A), "wrong");
const c7 = createCaptchaChallenge(IP_A, DIGITS);
check("too-long answer -> wrong", verifyCaptchaAnswer(c7.id, "۱۲۳۴۵۶", IP_A), "wrong");

// 12. non-numeric
const c8 = createCaptchaChallenge(IP_A, DIGITS);
check("non-numeric answer -> wrong", verifyCaptchaAnswer(c8.id, "abcd", IP_A), "wrong");

// 13. hash consistency between persian and latin
check("hash persian == hash latin", hashCaptchaAnswer(ANSWER_FA, "some-id") === hashCaptchaAnswer(ANSWER_LATIN, "some-id"), true);

// 14. unique PNGs per challenge
const c10 = createCaptchaChallenge(IP_A, DIGITS);
const c11 = createCaptchaChallenge(IP_A, DIGITS);
check("different challenges yield different image bytes", getCaptchaImage(c10.id).buffer.equals(getCaptchaImage(c11.id).buffer), false);

console.log(failures === 0 ? "ALL TESTS PASSED" : `${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
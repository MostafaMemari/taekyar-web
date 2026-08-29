import {
  createCaptchaChallenge,
  createCaptchaSessionToken,
  verifyCaptchaAnswer,
  hashCaptchaAnswer,
} from "./lib/comment-captcha.ts";

const FA = "۰۱۲۳۴۵۶۷۸۹";
const DIGITS = ["۷", "۳", "۹", "۴"];
const ANSWER_FA = DIGITS.join("");
const ANSWER_LATIN = ANSWER_FA.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)));

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
}

function imageSignature(buffer: Buffer): string {
  if (buffer[0] === 0x89 && buffer.subarray(1, 4).toString() === "PNG") return "png";
  if (buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP") return "webp";
  return "unknown";
}

const IP_A = "hash-a";
const IP_B = "hash-b";
const FAR_FUTURE = Date.now() + 6 * 60 * 1000;

// Each group gets its own session so leftover challenges cannot bleed between assertions.
const freshSession = (): string => createCaptchaSessionToken();

function mint(sessionToken: string, ipHash: string | null = IP_A, forcedDigits?: string[]) {
  return createCaptchaChallenge({ sessionToken, ipHash, forcedDigits });
}

function mintKnown(sessionToken: string, ipHash: string | null = IP_A) {
  return mint(sessionToken, ipHash, DIGITS);
}

function verify(sessionToken: string | null, answer: string, ipHash: string | null = IP_A, now?: number) {
  return verifyCaptchaAnswer({ sessionToken, answer, ipHash, now });
}

/* ---------------------------------------------------------- image output */
{
  const session = freshSession();
  const { image } = mint(session);

  check("image is a real raster format", ["png", "webp"].includes(imageSignature(image.buffer)), true);
  check("content type matches bytes", image.contentType, `image/${imageSignature(image.buffer)}`);
  check("image is non-trivial (>=1KB)", image.buffer.length >= 1000, true);

  const ascii = image.buffer.toString("latin1");
  check("no svg/text markup in image bytes", ascii.includes("<text") || ascii.includes("<svg"), false);
  check("plaintext digits not embedded in image bytes", ascii.includes(ANSWER_FA) || ascii.includes(ANSWER_LATIN), false);
}

/* ----------------------------------------------- every request is unique */
{
  const session = freshSession();
  const a = mint(session);
  const b = mint(session);
  check("two requests yield different images", a.image.buffer.equals(b.image.buffer), false);
  check("two requests yield different ids", a.id === b.id, false);
}

/* ------------------------------------------------------------ happy path */
{
  const session = freshSession();
  mintKnown(session);
  check("correct persian answer accepted", verify(session, ANSWER_FA), "ok");
  check("reusing solved captcha rejected (expired)", verify(session, ANSWER_FA), "expired");
}
{
  const session = freshSession();
  mintKnown(session);
  check("english digits accepted", verify(session, ANSWER_LATIN), "ok");
}

/* ------------------------------------- single-use + one guess per image */
{
  const session = freshSession();
  mintKnown(session);
  mintKnown(session);
  check("wrong answer -> wrong", verify(session, "۱۱۱۱"), "wrong");
  check("surviving challenge still solvable", verify(session, ANSWER_FA), "ok");
  check("all challenges consumed", verify(session, ANSWER_FA), "expired");
}

/* --------------------------------------------------------------- expiry */
{
  const session = freshSession();
  mintKnown(session);
  check("expired captcha rejected", verify(session, ANSWER_FA, IP_A, FAR_FUTURE), "expired");
}

/* ------------------------------------------------------ session binding */
{
  const mine = freshSession();
  const theirs = freshSession();
  mintKnown(theirs);
  check("challenge not usable from another session", verify(mine, ANSWER_FA), "expired");
  check("challenge usable from its own session", verify(theirs, ANSWER_FA), "ok");
}

/* ----------------------------------------------------------- ip binding */
{
  const session = freshSession();
  mintKnown(session, IP_A);
  check("different ip rejected", verify(session, ANSWER_FA, IP_B), "expired");
  check("same ip accepted", verify(session, ANSWER_FA, IP_A), "ok");
}

/* ------------------------------------------- malformed input burns one */
{
  const session = freshSession();
  mintKnown(session);
  check("non-numeric answer -> wrong", verify(session, "abcd"), "wrong");
}
{
  const session = freshSession();
  mintKnown(session);
  check("too-short answer -> wrong", verify(session, "۱۲"), "wrong");
}
{
  const session = freshSession();
  mintKnown(session);
  check("too-long answer -> wrong", verify(session, "۱۲۳۴۵۶"), "wrong");
}

/* ------------------------------------------------------ missing session */
check("null session -> expired", verify(null, ANSWER_FA), "expired");
check("unknown session -> expired", verify(freshSession(), ANSWER_FA), "expired");

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

console.log(failures === 0 ? "ALL TESTS PASSED" : `${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);

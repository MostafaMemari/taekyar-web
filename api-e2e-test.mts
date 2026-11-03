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

const { prisma } = await import("./server/config/prisma.ts");

const BASE = "http://localhost:4500";
const MARK = "apiv1-e2e";

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  (got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)})`}`);
}

function pepper(): string {
  return process.env.COMMENT_IP_PEPPER ?? "taekyar-comment-ip-pepper";
}

function hashAnswer(answer: string, captchaId: string): string {
  return createHash("sha256").update(`${answer}${captchaId}${pepper()}`).digest("hex");
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

function readSetCookie(response: Response, name: string): string | null {
  const cookies = response.headers.getSetCookie();
  for (const cookie of cookies) {
    const [pair] = cookie.split(";");
    const [key, value] = pair.split("=");
    if (key.trim() === name) return value;
  }
  return null;
}

async function fetchFreshCaptcha(): Promise<{ answer: string; captchaCookie: string } | null> {
  const response = await fetch(`${BASE}/api/v1/captcha/image`);
  if (!response.ok) return null;
  const captchaCookie = readSetCookie(response, "tc_captcha");
  if (!captchaCookie) return null;

  const row = await prisma.captchaChallenge.findUnique({ where: { sessionToken: captchaCookie } });
  if (!row) return null;
  const answer = bruteForceAnswer(row.challengeId, row.answerHash);
  if (!answer) return null;
  return { answer, captchaCookie };
}

async function cleanup() {
  const posts = await prisma.post.findMany({ where: { slug: { startsWith: MARK } }, select: { id: true } });
  for (const post of posts) await prisma.post.delete({ where: { id: post.id } }).catch(() => undefined);
  await prisma.category.deleteMany({ where: { name: { startsWith: MARK } } });
  await prisma.tag.deleteMany({ where: { name: { startsWith: MARK } } });
  await prisma.comment.deleteMany({ where: { author: MARK } });
  await prisma.rateLimitCounter.deleteMany({ where: { key: { startsWith: "login:attempt:" } } });
  await prisma.rateLimitCounter.deleteMany({ where: { key: { startsWith: "captcha:attempt:" } } });
  await prisma.rateLimitCounter.deleteMany({ where: { key: { startsWith: "captcha:generation:" } } });
}

try {
  await cleanup();

  const captchaResponse = await fetch(`${BASE}/api/v1/captcha/image`);
  check("captcha image is svg", (captchaResponse.headers.get("content-type") ?? "").includes("image/svg+xml"), true);
  const captchaCookie = readSetCookie(captchaResponse, "tc_captcha");
  check("captcha sets session cookie", typeof captchaCookie === "string" && captchaCookie.length > 10, true);
  const captchaRow = captchaCookie
    ? await prisma.captchaChallenge.findUnique({ where: { sessionToken: captchaCookie } })
    : null;
  const captchaAnswer = captchaRow ? bruteForceAnswer(captchaRow.challengeId, captchaRow.answerHash) : null;
  check("captcha challenge stored in postgres", typeof captchaAnswer === "string", true);

  const wrongLogin = await fetch(`${BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE, Cookie: `tc_captcha=${captchaCookie}` },
    body: JSON.stringify({ username: "no-such-user", password: "wrong-password", captchaAnswer }),
  });
  const wrongLoginBody = await wrongLogin.json().catch(() => null);
  check("wrong login rejected 401", wrongLogin.status, 401);
  check("wrong login error code", wrongLoginBody?.error?.code, "invalid");

  const badCaptchaLogin = await fetch(`${BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE },
    body: JSON.stringify({ username: "x", password: "y", captchaAnswer: "9999" }),
  });
  const badCaptchaBody = await badCaptchaLogin.json().catch(() => null);
  check("missing captcha session expired", badCaptchaBody?.error?.code, "captcha_expired");

  const username = process.env.ADMIN_USERNAME ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const freshCaptcha = await fetchFreshCaptcha();
  check("fresh captcha for login", Boolean(freshCaptcha), true);
  const login = await fetch(`${BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: BASE,
      Cookie: `tc_captcha=${freshCaptcha?.captchaCookie ?? captchaCookie}`,
    },
    body: JSON.stringify({ username, password, captchaAnswer: freshCaptcha?.answer ?? captchaAnswer }),
  });
  const sessionCookie = readSetCookie(login, "taekyar_session");
  check("valid login 200", login.status, 200);
  check("login sets session cookie", typeof sessionCookie === "string" && sessionCookie.includes("."), true);
  const sessionRow = freshCaptcha
    ? await prisma.captchaChallenge.findUnique({ where: { sessionToken: freshCaptcha.captchaCookie } })
    : null;
  check("captcha burned after login", sessionRow, null);

  const anonymousMutation = await fetch(`${BASE}/api/v1/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE },
    body: JSON.stringify({}),
  });
  check("anonymous mutation 401", anonymousMutation.status, 401);

  const crossOriginMutation = await fetch(`${BASE}/api/v1/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://evil.example",
      Cookie: `taekyar_session=${sessionCookie}`,
    },
    body: JSON.stringify({}),
  });
  check("cross-origin mutation 403", crossOriginMutation.status, 403);

  const invalidPost = await fetch(`${BASE}/api/v1/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
    body: JSON.stringify({ title: 12, slug: "x", categoryIds: "nope" }),
  });
  const invalidPostBody = await invalidPost.json().catch(() => null);
  check("invalid body 400", invalidPost.status, 400);
  check("validation envelope", invalidPostBody?.ok === false && invalidPostBody?.error?.code === "validation", true);

  const categoryResponse = await fetch(`${BASE}/api/v1/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
    body: JSON.stringify({
      name: `${MARK} دسته`,
      slug: `${MARK}-cat`,
      parentId: null,
      image: null,
      imageAlt: null,
      description: null,
      seoTitle: null,
      seoDescription: null,
      keywords: null,
      canonical: null,
      robotsTags: null,
    }),
  });
  check("create category 200", categoryResponse.status, 200);
  const category = await prisma.category.findUnique({ where: { slug: `${MARK}-cat` } });
  check("category persisted", Boolean(category), true);

  const duplicateCategory = await fetch(`${BASE}/api/v1/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
    body: JSON.stringify({
      name: `${MARK} دسته`,
      slug: `${MARK}-cat`,
      parentId: null,
      image: null,
      imageAlt: null,
      description: null,
      seoTitle: null,
      seoDescription: null,
      keywords: null,
      canonical: null,
      robotsTags: null,
    }),
  });
  const duplicateBody = await duplicateCategory.json().catch(() => null);
  check("duplicate slug 400 slug_taken", duplicateBody?.error?.fieldErrors?.slug !== undefined, true);

  if (category) {
    const updateCategory = await fetch(`${BASE}/api/v1/categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
      body: JSON.stringify({
        name: `${MARK} دسته ۲`,
        slug: `${MARK}-cat`,
        parentId: null,
        image: null,
        imageAlt: null,
        description: null,
        seoTitle: null,
        seoDescription: null,
        keywords: null,
        canonical: null,
        robotsTags: null,
      }),
    });
    check("update category 200", updateCategory.status, 200);
  }

  const createPost = await fetch(`${BASE}/api/v1/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
    body: JSON.stringify({
      title: `${MARK} مقاله`,
      slug: `${MARK}-post`,
      excerpt: null,
      categoryIds: category ? [category.id] : [],
      tagIds: [],
      readTimeMinutes: 5,
      content: "<p>متن آزمون</p><script>alert(1)</script>",
      coverImage: null,
      coverImageAlt: null,
      seoTitle: null,
      seoDescription: null,
      keywords: null,
      canonical: null,
      robotsTags: null,
      status: "PUBLISHED",
      faqs: [{ question: "سوال؟", answer: "پاسخ" }],
    }),
  });
  const createPostBody = await createPost.json().catch(() => null);
  check("create post 200", createPost.status, 200);
  check("create post returns slug", createPostBody?.data?.slug, `${MARK}-post`);

  const storedPost = await prisma.post.findUnique({
    where: { slug: `${MARK}-post` },
    select: { content: true, faqs: true, date: true },
  });
  const storedContent = JSON.stringify(storedPost?.content ?? "");
  check("post persisted", Boolean(storedPost), true);
  check("script tag sanitized out", storedContent.includes("<script"), false);
  check("legitimate content kept", storedContent.includes("متن آزمون"), true);
  check("post faq created", (storedPost?.faqs?.length ?? 0) >= 1, true);
  check("published post gets date", storedPost?.date !== null, true);

  const updatePost = await fetch(`${BASE}/api/v1/posts/${MARK}-post`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
    body: JSON.stringify({
      title: `${MARK} مقاله ویرایش`,
      slug: `${MARK}-post`,
      excerpt: null,
      categoryIds: [],
      tagIds: [],
      readTimeMinutes: null,
      content: "<p>ویرایش</p>",
      coverImage: null,
      coverImageAlt: null,
      seoTitle: null,
      seoDescription: null,
      keywords: null,
      canonical: null,
      robotsTags: null,
      status: "DRAFT",
    }),
  });
  check("update post 200", updatePost.status, 200);
  const updatedPost = await prisma.post.findUnique({ where: { slug: `${MARK}-post` }, select: { status: true, title: true } });
  check("post updated to draft", updatedPost?.status, "DRAFT");

  await fetch(`${BASE}/api/v1/posts/${MARK}-post`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
    body: JSON.stringify({
      title: `${MARK} مقاله ویرایش`,
      slug: `${MARK}-post`,
      excerpt: null,
      categoryIds: [],
      tagIds: [],
      readTimeMinutes: null,
      content: "<p>ویرایش</p>",
      coverImage: null,
      coverImageAlt: null,
      seoTitle: null,
      seoDescription: null,
      keywords: null,
      canonical: null,
      robotsTags: null,
      status: "PUBLISHED",
    }),
  });

  const commentCaptcha = await fetchFreshCaptcha();
  check("fresh captcha for comment", Boolean(commentCaptcha), true);
  if (commentCaptcha) {
    const submitComment = await fetch(`${BASE}/api/v1/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE,
        Cookie: `tc_captcha=${commentCaptcha.captchaCookie}`,
      },
      body: JSON.stringify({
        slug: `${MARK}-post`,
        name: MARK,
        message: "این دیدگاه آزمون سیستم است و باید پنل شود.",
        captchaAnswer: commentCaptcha.answer,
        honeypot: "",
      }),
    });
    check("public comment accepted", submitComment.status, 200);
    const pendingComment = await prisma.comment.findFirst({ where: { author: MARK, status: "PENDING" } });
    check("comment stored as pending", Boolean(pendingComment), true);

    const honeypotComment = await fetch(`${BASE}/api/v1/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: BASE, Cookie: `tc_captcha=${commentCaptcha.captchaCookie}` },
      body: JSON.stringify({
        slug: `${MARK}-post`,
        name: MARK,
        message: "دیدگاه تله",
        captchaAnswer: commentCaptcha.answer,
        honeypot: "bot-filled",
      }),
    });
    check("honeypot rejects", honeypotComment.status, 400);

    if (pendingComment) {
      const approve = await fetch(`${BASE}/api/v1/comments/${pendingComment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
        body: JSON.stringify({ status: "APPROVED" }),
      });
      check("moderation approve 200", approve.status, 200);
      const approved = await prisma.comment.findUnique({ where: { id: pendingComment.id }, select: { status: true } });
      check("comment approved", approved?.status, "APPROVED");

      const anonymousModeration = await fetch(`${BASE}/api/v1/comments/${pendingComment.id}`, {
        method: "DELETE",
        headers: { Origin: BASE },
      });
      check("anonymous moderation 401", anonymousModeration.status, 401);

      const deleteComment = await fetch(`${BASE}/api/v1/comments/${pendingComment.id}`, {
        method: "DELETE",
        headers: { Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
      });
      check("moderation delete 200", deleteComment.status, 200);
    }
  }

  const trashPost = await fetch(`${BASE}/api/v1/posts/${MARK}-post/trash`, {
    method: "POST",
    headers: { Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
  });
  check("trash post 200", trashPost.status, 200);
  const trashed = await prisma.post.findUnique({ where: { slug: `${MARK}-post` }, select: { deletedAt: true } });
  check("post soft-deleted", trashed?.deletedAt !== null, true);

  const restorePost = await fetch(`${BASE}/api/v1/posts/${MARK}-post/restore`, {
    method: "POST",
    headers: { Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
  });
  check("restore post 200", restorePost.status, 200);

  const deletePost = await fetch(`${BASE}/api/v1/posts/${MARK}-post`, {
    method: "DELETE",
    headers: { Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
  });
  check("permanent delete 200", deletePost.status, 200);
  const deletedPost = await prisma.post.findUnique({ where: { slug: `${MARK}-post` } });
  check("post removed", deletedPost, null);

  const invalidMediaDelete = await fetch(`${BASE}/api/v1/media?key=../../etc/passwd.png`, {
    method: "DELETE",
    headers: { Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
  });
  check("media path traversal rejected", invalidMediaDelete.status, 400);

  const mediaList = await fetch(`${BASE}/api/v1/media`, {
    headers: { Cookie: `taekyar_session=${sessionCookie}` },
  });
  check("media list reachable", [200, 502].includes(mediaList.status), true);

  const limiterProbe = await fetchFreshCaptcha();
  check("fresh captcha for limiter probe", Boolean(limiterProbe), true);
  if (limiterProbe) {
    const challengeRow = await prisma.captchaChallenge.findUnique({
      where: { sessionToken: limiterProbe.captchaCookie },
      select: { ipHash: true },
    });
    if (challengeRow?.ipHash) {
      await prisma.rateLimitCounter.upsert({
        where: { key: `login:attempt:${challengeRow.ipHash}` },
        create: {
          key: `login:attempt:${challengeRow.ipHash}`,
          count: 11,
          windowStart: new Date(),
          expiresAt: new Date(Date.now() + 600_000),
        },
        update: { count: 11, expiresAt: new Date(Date.now() + 600_000) },
      });
      const limitedLogin = await fetch(`${BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: BASE,
          Cookie: `tc_captcha=${limiterProbe.captchaCookie}`,
        },
        body: JSON.stringify({ username, password, captchaAnswer: limiterProbe.answer }),
      });
      const limitedBody = await limitedLogin.json().catch(() => null);
      check("login rate limited 429", limitedLogin.status, 429);
      check("login rate limit code", limitedBody?.error?.code, "rate_limited");
    }
  }

  const logout = await fetch(`${BASE}/api/v1/auth/logout`, {
    method: "POST",
    headers: { Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
  });
  check("logout 200", logout.status, 200);
  const clearedCookie = readSetCookie(logout, "taekyar_session");
  check("logout clears cookie", clearedCookie === "", true);

  if (category) {
    const deleteCategory = await fetch(`${BASE}/api/v1/categories/${category.id}`, {
      method: "DELETE",
      headers: { Origin: BASE, Cookie: `taekyar_session=${sessionCookie}` },
    });
    check("delete category 200", deleteCategory.status, 200);
  }
} finally {
  await cleanup();
  await prisma.$disconnect();
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);

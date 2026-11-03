import { NextResponse, type NextRequest } from "next/server";

import { submitCommentSchema } from "@/lib/validation/comment.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { submitPublicComment } from "@/server/services/comments.service";
import { CAPTCHA_SESSION_COOKIE } from "@/server/services/captcha.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REASON_STATUS: Record<string, number> = {
  validation: 400,
  captcha_wrong: 400,
  captcha_expired: 400,
  rate_limited: 429,
  not_found: 404,
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);

    const body = await parseJsonBody(request, submitCommentSchema);
    const captchaSessionToken = request.cookies.get(CAPTCHA_SESSION_COOKIE)?.value ?? null;

    const result = await submitPublicComment(
      {
        slug: body.slug,
        name: body.name,
        message: body.message,
        parentId: body.parentId ?? null,
        captchaAnswer: body.captchaAnswer,
        honeypot: body.honeypot ?? "",
      },
      { headers: request.headers, captchaSessionToken },
    );

    if (!result.ok) {
      return jsonError(REASON_STATUS[result.reason] ?? 400, result.reason);
    }

    return jsonOk({ ok: true });
  });
}

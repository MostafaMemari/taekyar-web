import { NextResponse, type NextRequest } from "next/server";

import { commentStatusSchema } from "@/lib/validation/comment.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { deleteComment, setCommentStatus } from "@/server/services/comments.service";
import { revalidateCommentTargets } from "@/server/services/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();
    const { id } = await params;

    const body = await parseJsonBody(request, commentStatusSchema);
    const result = await setCommentStatus(id, body.status);

    if (result.ok && result.postSlug) {
      revalidateCommentTargets(result.postSlug);
    }

    return result.ok ? jsonOk({ ok: true }) : jsonError(404, "not_found");
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();
    const { id } = await params;

    const result = await deleteComment(id);

    if (result.ok && result.postSlug) {
      revalidateCommentTargets(result.postSlug);
    }

    return result.ok ? jsonOk({ ok: true }) : jsonError(404, "not_found");
  });
}

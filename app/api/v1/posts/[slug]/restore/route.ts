import { NextResponse, type NextRequest } from "next/server";

import { handleApi, jsonError, jsonOk, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { restorePost } from "@/server/services/posts.service";
import { revalidatePostPaths } from "@/server/services/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();
    const { slug } = await params;

    const result = await restorePost(slug);
    if (!result.ok) return jsonError(404, "not_found");

    revalidatePostPaths(slug);
    return jsonOk({ ok: true });
  });
}

import { NextResponse, type NextRequest } from "next/server";

import { postInputSchema } from "@/lib/validation/post.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { createPost } from "@/server/services/posts.service";
import { revalidatePostPaths } from "@/server/services/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();

    const body = await parseJsonBody(request, postInputSchema);
    const result = await createPost(body);

    if (!result.ok) {
      return jsonError(400, "validation", { message: result.message, fieldErrors: result.fieldErrors });
    }

    if (result.slug) revalidatePostPaths(result.slug);
    return jsonOk({ slug: result.slug });
  });
}

import { NextResponse, type NextRequest } from "next/server";

import { postFaqsSchema } from "@/lib/validation/post.schema";
import { handleApi, jsonOk, parseJsonBody, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { savePostFaqs } from "@/server/services/faqs.service";
import { revalidateFaqPaths } from "@/server/services/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();
    const { slug } = await params;

    const body = await parseJsonBody(request, postFaqsSchema);
    const result = await savePostFaqs(slug, body.faqs);

    if (result.ok) revalidateFaqPaths(slug);
    return jsonOk(result);
  });
}

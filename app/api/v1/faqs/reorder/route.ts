import { NextResponse, type NextRequest } from "next/server";

import { faqReorderSchema } from "@/lib/validation/faq.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { reorderHomepageFaqs } from "@/server/services/faqs.service";
import { revalidateFaqPaths } from "@/server/services/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();

    const body = await parseJsonBody(request, faqReorderSchema);
    const result = await reorderHomepageFaqs(body.ids);
    if (!result.ok) return jsonError(404, "not_found");

    revalidateFaqPaths();
    return jsonOk({ ok: true });
  });
}

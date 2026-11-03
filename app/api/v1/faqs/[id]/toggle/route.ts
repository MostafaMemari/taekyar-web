import { NextResponse, type NextRequest } from "next/server";

import { faqToggleSchema } from "@/lib/validation/faq.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { toggleHomepageFaq } from "@/server/services/faqs.service";
import { revalidateFaqPaths } from "@/server/services/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();
    const { id } = await params;

    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) return jsonError(400, "validation");

    const body = await parseJsonBody(request, faqToggleSchema);
    const result = await toggleHomepageFaq(numericId, body.isActive);
    if (!result.ok) return jsonError(404, "not_found");

    revalidateFaqPaths();
    return jsonOk({ ok: true });
  });
}

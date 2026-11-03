import { NextResponse, type NextRequest } from "next/server";

import { homepageFaqSchema } from "@/lib/validation/faq.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { createHomepageFaq } from "@/server/services/faqs.service";
import { revalidateFaqPaths } from "@/server/services/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();

    const body = await parseJsonBody(request, homepageFaqSchema);
    const result = await createHomepageFaq(body);

    if (!result.ok) {
      return jsonError(400, "validation", { message: result.message, fieldErrors: result.fieldErrors });
    }

    revalidateFaqPaths();
    return jsonOk({ ok: true });
  });
}

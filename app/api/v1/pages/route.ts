import { NextResponse, type NextRequest } from "next/server";

import { pageInputSchema } from "@/lib/validation/page.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { createPage } from "@/server/services/pages.service";
import { revalidatePagePaths } from "@/server/services/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();

    const body = await parseJsonBody(request, pageInputSchema);
    const result = await createPage(body);

    if (!result.ok) {
      return jsonError(400, "validation", { message: result.message, fieldErrors: result.fieldErrors });
    }

    if (result.slug) revalidatePagePaths(result.slug);
    return jsonOk({ slug: result.slug });
  });
}

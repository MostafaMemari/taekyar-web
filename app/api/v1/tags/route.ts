import { NextResponse, type NextRequest } from "next/server";

import { taxonomyInputSchema } from "@/lib/validation/taxonomy.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { saveTaxonomy } from "@/server/services/taxonomy.service";
import { revalidateTaxonomy } from "@/server/services/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();

    const body = await parseJsonBody(request, taxonomyInputSchema);
    const result = await saveTaxonomy("tag", null, body);

    if (!result.ok) {
      return jsonError(400, "validation", { message: result.message, fieldErrors: result.fieldErrors });
    }

    revalidateTaxonomy("tags");
    return jsonOk({ ok: true });
  });
}

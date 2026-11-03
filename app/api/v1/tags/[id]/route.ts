import { NextResponse, type NextRequest } from "next/server";

import { taxonomyInputSchema } from "@/lib/validation/taxonomy.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { deleteTaxonomy, saveTaxonomy } from "@/server/services/taxonomy.service";
import { revalidateTaxonomy } from "@/server/services/revalidation";

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

    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      return jsonError(400, "validation");
    }

    const body = await parseJsonBody(request, taxonomyInputSchema);
    const result = await saveTaxonomy("tag", numericId, body);

    if (!result.ok) {
      return jsonError(400, "validation", { message: result.message, fieldErrors: result.fieldErrors });
    }

    revalidateTaxonomy("tags");
    return jsonOk({ ok: true });
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

    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      return jsonError(400, "validation");
    }

    const result = await deleteTaxonomy("tag", numericId);
    if (!result.ok) return jsonError(409, result.reason ?? "not_found");

    revalidateTaxonomy("tags");
    return jsonOk({ ok: true });
  });
}

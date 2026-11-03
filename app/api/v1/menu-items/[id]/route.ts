import { NextResponse, type NextRequest } from "next/server";

import { menuItemSchema } from "@/lib/validation/menu.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { deleteMenuItem, updateMenuItem } from "@/server/services/menus.service";
import { revalidateMenus } from "@/server/services/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();
    const { id } = await params;

    const numericId = parseId(id);
    if (numericId === null) return jsonError(400, "validation");

    const body = await parseJsonBody(request, menuItemSchema);
    const result = await updateMenuItem(numericId, {
      ...body,
      pageId: body.pageId ?? null,
      postId: body.postId ?? null,
      categoryId: body.categoryId ?? null,
      tagId: body.tagId ?? null,
      customUrl: body.customUrl ?? null,
      parentId: body.parentId ?? null,
    });

    if (!result.ok) {
      return jsonError(400, "validation", { message: result.message, fieldErrors: result.fieldErrors });
    }

    revalidateMenus();
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

    const numericId = parseId(id);
    if (numericId === null) return jsonError(400, "validation");

    const result = await deleteMenuItem(numericId);
    if (!result.ok) return jsonError(404, "not_found");

    revalidateMenus();
    return jsonOk({ ok: true });
  });
}

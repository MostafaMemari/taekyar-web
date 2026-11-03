import { NextResponse, type NextRequest } from "next/server";

import { menuItemSchema } from "@/lib/validation/menu.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { createMenuItem } from "@/server/services/menus.service";
import { revalidateMenus } from "@/server/services/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();

    const body = await parseJsonBody(request, menuItemSchema);
    const result = await createMenuItem({
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

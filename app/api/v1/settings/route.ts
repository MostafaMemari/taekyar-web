import { NextResponse, type NextRequest } from "next/server";

import { settingsSchema } from "@/lib/validation/settings.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { revalidateSettings } from "@/server/services/revalidation";
import { saveSiteSettings } from "@/server/services/settings.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();

    const body = await parseJsonBody(request, settingsSchema);
    const result = await saveSiteSettings(body);

    if (!result.ok) {
      return jsonError(400, "validation", { message: result.message, fieldErrors: result.fieldErrors });
    }

    revalidateSettings();
    return jsonOk({ message: result.message });
  });
}

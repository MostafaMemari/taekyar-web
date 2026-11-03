import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { handleApi, jsonOk, parseQuery, requireApiSession } from "@/server/http/api";
import { resolveAdminBarEditContext } from "@/server/services/admin-bar.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const contextQuerySchema = z.object({
  pathname: z.string().min(1).max(2000),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleApi(async () => {
    await requireApiSession();

    const query = parseQuery(request, contextQuerySchema);
    const context = await resolveAdminBarEditContext(query.pathname);
    return jsonOk({ context });
  });
}

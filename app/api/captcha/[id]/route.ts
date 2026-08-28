import { NextResponse } from "next/server";

import { getCaptchaImage } from "@/lib/comment-captcha";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CaptchaImageRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: CaptchaImageRouteContext): Promise<NextResponse> {
  const { id } = await context.params;
  const image = getCaptchaImage(id);

  if (!image) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(new Uint8Array(image.buffer), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
    },
  });
}
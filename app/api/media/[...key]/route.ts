import { NextResponse } from "next/server";

import { isMediaKey } from "@/lib/media";
import { fetchObject } from "@/lib/r2";

const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

interface MediaRouteContext {
  params: Promise<{ key: string[] }>;
}

export async function GET(_request: Request, { params }: MediaRouteContext) {
  const { key } = await params;
  const objectKey = key.join("/");

  if (!isMediaKey(objectKey)) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const object = await fetchObject(objectKey);
    if (!object) return new NextResponse(null, { status: 404 });

    return new NextResponse(object.body, {
      headers: {
        "Content-Type": object.contentType,
        "Content-Length": String(object.contentLength),
        "Cache-Control": IMMUTABLE_CACHE,
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}

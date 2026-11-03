import { AwsClient } from "aws4fetch";

import { MEDIA_MAX_BYTES, MEDIA_PREFIX, isMediaKey, toMediaItem, type R2Object } from "@/lib/media";
import { r2PublicUrl } from "@/lib/r2-url";
import type { MediaPage, MediaUploadResult } from "@/types/api";
import { requireEnv } from "@/server/config/env";

const LIST_PAGE_SIZE = 1000;
const LIST_MAX_KEYS = 5000;

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function createR2Client(): AwsClient {
  return new AwsClient({
    accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    service: "s3",
    region: "auto",
  });
}

function getEndpoint(): string {
  return `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`;
}

function r2Bucket(): string {
  return requireEnv("R2_BUCKET_NAME");
}

function matchesMagicBytes(bytes: Uint8Array, type: string): boolean {
  if (type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (type === "image/png") {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }
  if (type === "image/webp") {
    return (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    );
  }
  return false;
}

export async function uploadImage(file: File): Promise<MediaUploadResult> {
  const extension = ALLOWED_IMAGE_TYPES[file.type];
  if (!extension) return { ok: false, error: "UNSUPPORTED_TYPE" };
  if (file.size > MEDIA_MAX_BYTES) return { ok: false, error: "FILE_TOO_LARGE" };

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!matchesMagicBytes(bytes, file.type)) return { ok: false, error: "UNSUPPORTED_TYPE" };

  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const key = `uploads/${now.getUTCFullYear()}/${month}/${crypto.randomUUID()}.${extension}`;

  const client = createR2Client();
  const response = await client.fetch(`${getEndpoint()}/${r2Bucket()}/${key}`, {
    method: "PUT",
    body: bytes,
    headers: { "Content-Type": file.type },
  });

  if (!response.ok) return { ok: false, error: "UPLOAD_FAILED" };
  return { ok: true, key };
}

export async function deleteImage(key: string): Promise<void> {
  const client = createR2Client();
  const response = await client.fetch(`${getEndpoint()}/${r2Bucket()}/${key}`, {
    method: "DELETE",
  });
  if (!response.ok && response.status !== 404) throw new Error("DELETE_FAILED");
}

const CONTENTS_PATTERN = /<Contents>([\s\S]*?)<\/Contents>/g;
const TAG_PATTERN = /<([A-Za-z]+)>([\s\S]*?)<\/\1>/g;

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function readXmlTags(source: string): Record<string, string> {
  const tags: Record<string, string> = {};
  for (const [, name, value] of source.matchAll(TAG_PATTERN)) {
    tags[name] = decodeXmlEntities(value);
  }
  return tags;
}

interface ListObjectsPage {
  objects: R2Object[];
  isTruncated: boolean;
  continuationToken: string | null;
}

function parseListObjectsXml(xml: string): ListObjectsPage {
  const objects = Array.from(xml.matchAll(CONTENTS_PATTERN), ([, block]) => {
    const tags = readXmlTags(block);
    return {
      key: tags.Key ?? "",
      size: Number(tags.Size) || 0,
      lastModified: tags.LastModified ?? "",
    };
  });

  const root = readXmlTags(xml);
  return {
    objects,
    isTruncated: root.IsTruncated === "true",
    continuationToken: root.NextContinuationToken ?? null,
  };
}

async function listObjects(prefix = ""): Promise<R2Object[]> {
  const client = createR2Client();
  const objects: R2Object[] = [];
  let continuationToken: string | null = null;

  while (objects.length < LIST_MAX_KEYS) {
    const params = new URLSearchParams({
      "list-type": "2",
      "max-keys": String(Math.min(LIST_PAGE_SIZE, LIST_MAX_KEYS - objects.length)),
    });
    if (prefix) params.set("prefix", prefix);
    if (continuationToken) params.set("continuation-token", continuationToken);

    const response = await client.fetch(`${getEndpoint()}/${r2Bucket()}/?${params.toString()}`, {
      method: "GET",
    });
    if (!response.ok) throw new Error("LIST_FAILED");

    const page = parseListObjectsXml(await response.text());
    objects.push(...page.objects);

    if (!page.isTruncated || !page.continuationToken || page.objects.length === 0) break;
    continuationToken = page.continuationToken;
  }

  return objects;
}

export const MEDIA_PAGE_SIZE = 24;

export async function getMediaPage(
  options: { query?: string; page?: number; perPage?: number } = {},
): Promise<MediaPage> {
  const perPage = options.perPage ?? MEDIA_PAGE_SIZE;

  let objects: R2Object[] = [];
  let failed = false;
  try {
    objects = await listObjects(MEDIA_PREFIX);
  } catch {
    failed = true;
  }

  const query = (options.query ?? "").trim().toLowerCase();
  const items = objects
    .map((object) => toMediaItem(object, r2PublicUrl(object.key)))
    .filter((item) => !query || item.name.toLowerCase().includes(query))
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(Math.max(Number(options.page) || 1, 1), totalPages);

  return {
    items: items.slice((currentPage - 1) * perPage, currentPage * perPage),
    total,
    totalPages,
    currentPage,
    failed,
  };
}

export async function deleteMedia(key: string): Promise<{ ok: boolean }> {
  if (!isMediaKey(key)) return { ok: false };

  try {
    await deleteImage(key);
  } catch {
    return { ok: false };
  }

  return { ok: true };
}

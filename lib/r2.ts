import { AwsClient } from "aws4fetch";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

function createR2Client(): AwsClient {
  return new AwsClient({
    accessKeyId: getRequiredEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: getRequiredEnv("R2_SECRET_ACCESS_KEY"),
    service: "s3",
    region: "auto",
  });
}

function getEndpoint(): string {
  return `https://${getRequiredEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`;
}

export function isAllowedImageType(type: string): boolean {
  return type in ALLOWED_IMAGE_TYPES;
}

export async function uploadImage(file: File): Promise<string> {
  if (!isAllowedImageType(file.type)) throw new Error("UNSUPPORTED_TYPE");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("FILE_TOO_LARGE");

  const bucket = getRequiredEnv("R2_BUCKET_NAME");
  const extension = ALLOWED_IMAGE_TYPES[file.type];
  const key = `uploads/${crypto.randomUUID()}.${extension}`;

  const client = createR2Client();
  const response = await client.fetch(`${getEndpoint()}/${bucket}/${key}`, {
    method: "PUT",
    body: await file.arrayBuffer(),
    headers: { "Content-Type": file.type },
  });

  if (!response.ok) throw new Error("UPLOAD_FAILED");
  return key;
}

export interface R2Object {
  key: string;
  size: number;
  lastModified: string;
}

interface ListObjectsPage {
  objects: R2Object[];
  isTruncated: boolean;
  continuationToken: string | null;
}

const LIST_PAGE_SIZE = 1000;
const LIST_MAX_KEYS = 5000;

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

export interface MediaObject {
  body: ReadableStream<Uint8Array>;
  contentType: string;
  contentLength: number;
}

export async function fetchObject(key: string): Promise<MediaObject | null> {
  const bucket = getRequiredEnv("R2_BUCKET_NAME");
  const client = createR2Client();
  const response = await client.fetch(`${getEndpoint()}/${bucket}/${key}`, { method: "GET" });
  if (!response.ok || !response.body) return null;

  return {
    body: response.body,
    contentType: response.headers.get("content-type") ?? "application/octet-stream",
    contentLength: Number(response.headers.get("content-length")) || 0,
  };
}

export async function listObjects(prefix = ""): Promise<R2Object[]> {
  const bucket = getRequiredEnv("R2_BUCKET_NAME");
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

    const response = await client.fetch(`${getEndpoint()}/${bucket}/?${params.toString()}`, {
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

export async function deleteImage(key: string): Promise<void> {
  const bucket = getRequiredEnv("R2_BUCKET_NAME");
  const client = createR2Client();
  const response = await client.fetch(`${getEndpoint()}/${bucket}/${key}`, {
    method: "DELETE",
  });
  if (!response.ok && response.status !== 404) throw new Error("DELETE_FAILED");
}

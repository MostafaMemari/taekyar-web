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

export async function deleteImage(key: string): Promise<void> {
  const bucket = getRequiredEnv("R2_BUCKET_NAME");
  const client = createR2Client();
  const response = await client.fetch(`${getEndpoint()}/${bucket}/${key}`, {
    method: "DELETE",
  });
  if (!response.ok && response.status !== 404) throw new Error("DELETE_FAILED");
}

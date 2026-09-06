import { buildLlmsTxt } from "@/lib/llms-txt";

export const revalidate = 3600;

export async function GET(): Promise<Response> {
  const text = await buildLlmsTxt();

  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

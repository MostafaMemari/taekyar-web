"use server";

import { getSession } from "@/lib/auth";
import { resolveAdminBarEditContext } from "./admin-bar-context";

export async function getAdminBarEditContext(pathname: string): Promise<Awaited<ReturnType<typeof resolveAdminBarEditContext>>> {
  const session = await getSession();
  if (!session) return null;

  return resolveAdminBarEditContext(pathname);
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export function optionalEnv(name: string): string | undefined {
  return process.env[name];
}

export function getIpPepper(): string {
  return optionalEnv("COMMENT_IP_PEPPER") ?? "taekyar-comment-ip-pepper";
}

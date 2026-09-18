import type { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "caixiang_session";

function secret() { return process.env.SESSION_SECRET || "local-caixiang-preview-secret"; }
function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }

export function createSessionValue(userId: string, role: string) {
  const payload = Buffer.from(JSON.stringify({ userId, role, exp: Date.now() + 30 * 86400000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSession(request: NextRequest) {
  const raw = request.cookies.get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString()) as { userId: string; role: string; exp: number };
    return value.exp > Date.now() ? value : null;
  } catch { return null; }
}

export const sessionCookieName = COOKIE;

export function getSiteUserId(request: NextRequest) {
  const session = readSession(request);
  if (session) return session.userId;
  const userId = request.headers.get("oai-authenticated-user-id");
  if (userId) return userId;
  if (process.env.NODE_ENV !== "production") return "local-preview-user";
  return null;
}

export function getSiteUserEmail(request: NextRequest) {
  return request.headers.get("oai-authenticated-user-email") ?? "preview@caixiang.local";
}

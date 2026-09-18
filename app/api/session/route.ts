import { NextRequest, NextResponse } from "next/server";
import { createSessionValue, readSession, sessionCookieName } from "@/lib/site-user";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = readSession(request);
  return NextResponse.json(session ? { authenticated: true, role: session.role } : { authenticated: false });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { phone?: string; role?: string };
  const phone = String(body.phone ?? "").replace(/\D/g, "");
  const role = body.role === "admin" ? "admin" : "customer";
  if (!/^1\d{10}$/.test(phone)) return NextResponse.json({ error: "手机号格式不正确。" }, { status: 400 });
  if (role === "admin") {
    const admins = (process.env.ADMIN_PHONES ?? "").split(",").map((v) => v.trim()).filter(Boolean);
    if (admins.length && !admins.includes(phone)) return NextResponse.json({ error: "该手机号没有管理员权限。" }, { status: 403 });
  }
  const response = NextResponse.json({ authenticated: true, role });
  response.cookies.set(sessionCookieName, createSessionValue(`phone:+86${phone}`, role), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 30 * 86400,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(sessionCookieName, "", { path: "/", maxAge: 0 });
  return response;
}

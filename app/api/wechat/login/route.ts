import { NextRequest, NextResponse } from "next/server";
import { createApiToken } from "@/lib/site-user";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { code?: string };
  const code = String(body.code ?? "");
  const appId = process.env.WECHAT_APP_ID;
  const secret = process.env.WECHAT_APP_SECRET;
  if (!code) return NextResponse.json({ error: "缺少微信登录凭证。" }, { status: 400 });
  if (!appId || !secret) return NextResponse.json({ error: "微信登录尚未配置。" }, { status: 503 });

  const params = new URLSearchParams({ appid: appId, secret, js_code: code, grant_type: "authorization_code" });
  const response = await fetch(`https://api.weixin.qq.com/sns/jscode2session?${params}`, { cache: "no-store" });
  const result = await response.json() as { openid?: string; unionid?: string; errcode?: number; errmsg?: string };
  if (!response.ok || !result.openid) {
    console.error("wechat_login_failed", result.errcode, result.errmsg);
    return NextResponse.json({ error: "微信登录失败，请稍后重试。" }, { status: 502 });
  }
  const token = createApiToken(`wechat:${result.openid}`, "customer");
  return NextResponse.json({ token, expiresIn: 30 * 86400 });
}

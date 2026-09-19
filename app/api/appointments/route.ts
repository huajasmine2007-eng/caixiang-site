import { NextRequest, NextResponse } from "next/server";
import { getSiteUserId } from "@/lib/site-user";
import { ensureSchema, sql } from "@/lib/postgres";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const userId = getSiteUserId(request);
  if (!userId) return json({ error: "请重新进入小程序后再预约。" }, 401);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ error: "预约信息格式不正确。" }, 400); }

  const serviceName = clean(body.serviceName, 80);
  const contactName = clean(body.contactName, 40);
  const contactMethod = clean(body.contactMethod, 80);
  const preferredDate = clean(body.preferredDate, 10);
  const preferredTime = clean(body.preferredTime, 30);
  const city = clean(body.city, 20);
  const note = clean(body.note, 300);
  if (!serviceName || !contactName || !contactMethod || !preferredDate || !preferredTime || !city) {
    return json({ error: "请填写完整的预约信息。" }, 400);
  }

  try {
    await ensureSchema();
    const db = sql();
    const id = crypto.randomUUID();
    const createdAt = Date.now();
    await db`INSERT INTO appointments
      (id, user_id, service_name, contact_name, contact_method, preferred_date, preferred_time, city, note, status, created_at)
      VALUES (${id}, ${userId}, ${serviceName}, ${contactName}, ${contactMethod}, ${preferredDate}, ${preferredTime}, ${city}, ${note || null}, 'pending', ${createdAt})`;
    return json({ id, status: "pending", createdAt }, 201);
  } catch (error) {
    console.error("appointment_save_failed", error);
    return json({ error: "预约暂时无法提交，请稍后重试。" }, 503);
  }
}

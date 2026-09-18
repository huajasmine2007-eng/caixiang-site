import { NextRequest, NextResponse } from "next/server";
import { getSiteUserId } from "@/lib/site-user";
import { ensureSchema, sql } from "@/lib/postgres";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  const userId = getSiteUserId(request);
  if (!userId) return json({ error: "请先登录后查看历史结果。" }, 401);
  try {
    await ensureSchema(); const db = sql();
    const result = await db`SELECT id, kind, color_season AS "colorSeason", twelve_type AS "twelveType",
      color_type AS "colorType", style_type AS "styleType", body_type AS "bodyType", frame_type AS "frameType",
      bmi, recommendations_json AS "recommendationsJson", created_at AS "createdAt"
      FROM assessment_results WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 30`;
    return json({ results: result });
  } catch (error) {
    console.error("assessment_list_failed", error);
    return json({ error: "历史结果暂时无法读取，请稍后重试。" }, 503);
  }
}

export async function POST(request: NextRequest) {
  const userId = getSiteUserId(request);
  if (!userId) return json({ error: "请先登录后保存结果。" }, 401);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ error: "结果格式不正确。" }, 400); }
  const kind = body.kind === "body" ? "body" : body.kind === "color" ? "color" : "combined";
  const id = crypto.randomUUID();
  const createdAt = Date.now();
  try {
    await ensureSchema(); const db = sql();
    const colorSeason = typeof body.colorSeason === "string" ? body.colorSeason : null;
    const twelveType = typeof body.twelveType === "string" ? body.twelveType : null;
    const colorType = typeof body.colorType === "string" ? body.colorType : null;
    const styleType = typeof body.styleType === "string" ? body.styleType : null;
    const bodyType = typeof body.bodyType === "string" ? body.bodyType : null;
    const frameType = typeof body.frameType === "string" ? body.frameType : null;
    const bmi = typeof body.bmi === "string" ? body.bmi : null;
    const recommendations = body.recommendations ? JSON.stringify(body.recommendations) : null;
    await db`INSERT INTO assessment_results
      (id, user_id, kind, color_season, twelve_type, color_type, style_type, body_type, frame_type, bmi, recommendations_json, created_at)
      VALUES (${id}, ${userId}, ${kind}, ${colorSeason}, ${twelveType}, ${colorType}, ${styleType}, ${bodyType}, ${frameType}, ${bmi}, ${recommendations}, ${createdAt})`;
    return json({ id, createdAt }, 201);
  } catch (error) {
    console.error("assessment_save_failed", error);
    return json({ error: "结果暂时无法保存，请保留当前页面后重试。" }, 503);
  }
}

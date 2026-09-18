import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSiteUserId } from "@/lib/site-user";
import { ensureSchema, sql } from "@/lib/postgres";

export const runtime = "nodejs";
const photoKinds = new Set(["full_body", "face_front", "face_left", "face_right"]);
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  const userId = getSiteUserId(request);
  if (!userId) return json({ error: "请先登录。" }, 401);
  try {
    await ensureSchema(); const db = sql();
    const result = await db`SELECT id, kind, filename, content_type AS "contentType", size, created_at AS "createdAt"
      FROM profile_photos WHERE user_id = ${userId} ORDER BY created_at DESC`;
    const latest = new Map<string, unknown>();
    for (const row of result as Array<Record<string, unknown>>) if (!latest.has(String(row.kind))) latest.set(String(row.kind), row);
    return json({ photos: Array.from(latest.values()) });
  } catch (error) {
    console.error("profile_photo_list_failed", error);
    return json({ error: "照片状态暂时无法读取。" }, 503);
  }
}

export async function POST(request: NextRequest) {
  const userId = getSiteUserId(request);
  if (!userId) return json({ error: "请先登录后上传。" }, 401);
  let formData: FormData;
  try { formData = await request.formData(); } catch { return json({ error: "无法读取照片。" }, 400); }
  const file = formData.get("image");
  const kind = String(formData.get("kind") ?? "");
  if (!(file instanceof File) || !photoKinds.has(kind)) return json({ error: "请选择正确的照片位置。" }, 400);
  if (!allowedTypes.has(file.type)) return json({ error: "仅支持 JPG、PNG、WebP。" }, 415);
  if (file.size <= 0 || file.size > 8 * 1024 * 1024) return json({ error: "单张照片需小于 8MB。" }, 413);
  const id = crypto.randomUUID();
  const objectKey = `profiles/${userId}/${kind}/${id}`;
  const createdAt = Date.now();
  try {
    await ensureSchema(); const db = sql();
    const blob = await put(objectKey, file, { access: "public", contentType: file.type, addRandomSuffix: false });
    const filename = file.name.slice(0, 180);
    await db`INSERT INTO profile_photos
      (id, user_id, kind, object_key, filename, content_type, size, created_at)
      VALUES (${id}, ${userId}, ${kind}, ${blob.url}, ${filename}, ${file.type}, ${file.size}, ${createdAt})`;
    return json({ id, kind, filename: file.name, createdAt }, 201);
  } catch (error) {
    console.error("profile_photo_upload_failed", error);
    return json({ error: "照片暂时无法保存，请稍后重试。" }, 503);
  }
}

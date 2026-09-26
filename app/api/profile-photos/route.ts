import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSiteUserId } from "@/lib/site-user";
import { ensureSchema, sql } from "@/lib/postgres";

export const runtime = "nodejs";
const photoKinds = new Set(["full_body", "face_front", "face_left", "face_right"]);
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxPhotoSize = 8 * 1024 * 1024;

type ClientUploadPayload = { id: string; kind: string; filename: string; size: number };
type UploadTokenPayload = ClientUploadPayload & { userId: string; createdAt: number };

function parseClientPayload(value: string | null | undefined): ClientUploadPayload {
  const payload = JSON.parse(value ?? "") as Partial<ClientUploadPayload>;
  if (typeof payload.id !== "string" || !/^[0-9a-f-]{36}$/i.test(payload.id)) throw new Error("照片编号无效。");
  if (!payload.kind || !photoKinds.has(payload.kind)) throw new Error("请选择正确的照片位置。");
  if (typeof payload.filename !== "string" || !payload.filename.trim()) throw new Error("无法读取照片名称。");
  if (typeof payload.size !== "number" || payload.size <= 0 || payload.size > maxPhotoSize) throw new Error("单张照片需小于 8MB。");
  return { id: payload.id, kind: payload.kind, filename: payload.filename.slice(0, 180), size: payload.size };
}

function parseTokenPayload(value: string | null | undefined): UploadTokenPayload {
  const payload = JSON.parse(value ?? "") as Partial<UploadTokenPayload>;
  const client = parseClientPayload(JSON.stringify(payload));
  if (typeof payload.userId !== "string" || typeof payload.createdAt !== "number") throw new Error("上传凭证无效。");
  return { ...client, userId: payload.userId, createdAt: payload.createdAt };
}

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
  let body: HandleUploadBody;
  try { body = await request.json() as HandleUploadBody; } catch { return json({ error: "无法读取上传请求。" }, 400); }
  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const userId = getSiteUserId(request);
        if (!userId) throw new Error("请先登录后上传。");
        const payload = parseClientPayload(clientPayload);
        if (!pathname.startsWith(`profiles/${payload.kind}/`)) throw new Error("照片位置不正确。");
        return {
          allowedContentTypes: Array.from(allowedTypes),
          maximumSizeInBytes: maxPhotoSize,
          addRandomSuffix: false,
          tokenPayload: JSON.stringify({ ...payload, userId, createdAt: Date.now() }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = parseTokenPayload(tokenPayload);
        await ensureSchema();
        const db = sql();
        await db`INSERT INTO profile_photos
          (id, user_id, kind, object_key, filename, content_type, size, created_at)
          VALUES (${payload.id}, ${payload.userId}, ${payload.kind}, ${blob.url}, ${payload.filename}, ${blob.contentType}, ${payload.size}, ${payload.createdAt})
          ON CONFLICT (id) DO NOTHING`;
      },
    });
    return json(response);
  } catch (error) {
    console.error("profile_photo_upload_failed", error);
    return json({ error: error instanceof Error ? error.message : "照片暂时无法保存，请稍后重试。" }, 400);
  }
}

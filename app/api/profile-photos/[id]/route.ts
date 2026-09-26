import { get } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import { getSiteUserId } from "@/lib/site-user";
import { ensureSchema, sql } from "@/lib/postgres";

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getSiteUserId(request);
  if (!userId) return NextResponse.json({ error: "请先登录。" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "照片编号无效。" }, { status: 400 });
  try {
    await ensureSchema();
    const db = sql();
    const rows = await db`SELECT object_key AS "objectKey" FROM profile_photos WHERE id = ${id} AND user_id = ${userId} LIMIT 1`;
    const photo = (rows as Array<{ objectKey: string }>)[0];
    if (!photo) return new NextResponse("Not found", { status: 404, headers: { "Cache-Control": "private, no-store" } });
    const result = await get(photo.objectKey, {
      access: "private",
      ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
    });
    if (!result) return new NextResponse("Not found", { status: 404, headers: { "Cache-Control": "private, no-store" } });
    if (result.statusCode === 304) return new NextResponse(null, { status: 304, headers: { ETag: result.blob.etag, "Cache-Control": "private, no-cache" } });
    if (result.statusCode !== 200) return new NextResponse("Not found", { status: 404, headers: { "Cache-Control": "private, no-store" } });
    return new NextResponse(result.stream, { headers: {
      "Content-Type": result.blob.contentType,
      "X-Content-Type-Options": "nosniff",
      ETag: result.blob.etag,
      "Cache-Control": "private, no-cache",
    } });
  } catch (error) {
    console.error("profile_photo_read_failed", error);
    return NextResponse.json({ error: "照片暂时无法读取。" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

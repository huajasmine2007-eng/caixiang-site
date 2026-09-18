import { NextRequest, NextResponse } from "next/server";
import { uniqloSeed } from "@/lib/uniqlo-products";
import { ensureSchema, sql } from "@/lib/postgres";

export const runtime = "nodejs";

async function ensureSeeded() {
  await ensureSchema(); const db = sql();
  const rows = await db`SELECT COUNT(*)::int AS count FROM products`;
  if (Number(rows[0]?.count ?? 0) > 0) return;
  const now = Date.now();
  for (const p of uniqloSeed) await db`INSERT INTO products
    (id, brand, sku, name_ko, name_zh, category, color_family, season_tags, body_tags, frame_tags, product_url, image_url, source, is_active, updated_at)
    VALUES (${p.id}, ${p.brand}, ${p.sku ?? null}, ${p.nameKo}, ${p.nameZh}, ${p.category}, ${p.colorFamily}, ${p.seasonTags}, ${p.bodyTags}, ${p.frameTags}, ${p.productUrl}, ${p.imageUrl ?? null}, ${p.source}, 1, ${now})
    ON CONFLICT (id) DO NOTHING`;
}

export async function GET(request: NextRequest) {
  const season = request.nextUrl.searchParams.get("season")?.toLowerCase() ?? "";
  const body = request.nextUrl.searchParams.get("body")?.toUpperCase() ?? "";
  try {
    await ensureSeeded(); const db = sql();
    const result = await db`SELECT id, brand, name_ko AS "nameKo", name_zh AS "nameZh", category,
      color_family AS "colorFamily", product_url AS "productUrl", image_url AS "imageUrl"
      FROM products WHERE is_active = 1
      AND (${season} = '' OR season_tags ILIKE '%' || ${season} || '%')
      AND (${body} = '' OR body_tags ILIKE '%' || ${body} || '%')
      ORDER BY category, updated_at DESC LIMIT 8`;
    return NextResponse.json({ products: result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("recommendations_failed", error);
    return NextResponse.json({ error: "推荐商品暂时无法读取。" }, { status: 503 });
  }
}

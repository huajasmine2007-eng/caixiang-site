import { NextRequest, NextResponse } from "next/server";
import { getSiteUserId } from "@/lib/site-user";
import { ensureSchema, sql } from "@/lib/postgres";

export const runtime = "nodejs";

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let value = "", quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { cells.push(value.trim()); value = ""; }
    else value += char;
  }
  cells.push(value.trim());
  return cells.map((cell) => cell.replace(/^"|"$/g, ""));
}

export async function POST(request: NextRequest) {
  const userId = getSiteUserId(request);
  if (!userId) return NextResponse.json({ error: "请先登录管理员账户。" }, { status: 401 });
  let formData: FormData;
  try { formData = await request.formData(); } catch { return NextResponse.json({ error: "无法读取文件。" }, { status: 400 }); }
  const file = formData.get("file");
  if (!(file instanceof File) || file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "请选择 2MB 以内的 CSV 文件。" }, { status: 400 });
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return NextResponse.json({ error: "CSV 没有商品数据。" }, { status: 400 });
  const headers = splitCsvLine(lines[0]);
  const required = ["id","brand","nameZh","nameKo","category","colorFamily","seasonTags","bodyTags","frameTags","productUrl"];
  if (required.some((key) => !headers.includes(key))) return NextResponse.json({ error: `CSV 缺少字段：${required.filter((key) => !headers.includes(key)).join("、")}` }, { status: 400 });
  const records = lines.slice(1, 501).map((line) => Object.fromEntries(headers.map((key, index) => [key, splitCsvLine(line)[index] ?? ""])));
  const now = Date.now();
  try {
    await ensureSchema(); const db = sql();
    for (const p of records) await db`INSERT INTO products
      (id, brand, sku, name_ko, name_zh, category, color_family, season_tags, body_tags, frame_tags, product_url, image_url, source, is_active, updated_at)
      VALUES (${p.id}, ${p.brand}, ${p.sku || null}, ${p.nameKo}, ${p.nameZh}, ${p.category}, ${p.colorFamily}, ${p.seasonTags}, ${p.bodyTags}, ${p.frameTags}, ${p.productUrl}, ${p.imageUrl || null}, ${p.source || "admin CSV"}, 1, ${now})
      ON CONFLICT (id) DO UPDATE SET brand=EXCLUDED.brand, sku=EXCLUDED.sku, name_ko=EXCLUDED.name_ko, name_zh=EXCLUDED.name_zh,
      category=EXCLUDED.category, color_family=EXCLUDED.color_family, season_tags=EXCLUDED.season_tags, body_tags=EXCLUDED.body_tags,
      frame_tags=EXCLUDED.frame_tags, product_url=EXCLUDED.product_url, image_url=EXCLUDED.image_url, source=EXCLUDED.source,
      is_active=1, updated_at=EXCLUDED.updated_at`;
    const importId = crypto.randomUUID(); const filename = file.name.slice(0, 180);
    await db`INSERT INTO product_imports (id, user_id, filename, imported_count, created_at)
      VALUES (${importId}, ${userId}, ${filename}, ${records.length}, ${now})`;
    return NextResponse.json({ imported: records.length });
  } catch (error) {
    console.error("product_import_failed", error);
    return NextResponse.json({ error: "商品数据导入失败，请检查字段。" }, { status: 503 });
  }
}

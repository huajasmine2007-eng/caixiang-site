import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/site-user";
import { ensureSchema, sql } from "@/lib/postgres";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
}

function displayPhone(userId: string) {
  return userId.startsWith("phone:+86") ? userId.slice("phone:+86".length) : userId;
}

export async function GET(request: NextRequest) {
  if (!isAdminSession(request)) return json({ error: "仅限已配置的管理员查看。" }, 403);

  try {
    await ensureSchema();
    const db = sql();
    const [statsRows, resultRows] = await Promise.all([
      db`SELECT
        (SELECT COUNT(DISTINCT user_id) FROM (
          SELECT user_id FROM assessment_results
          UNION SELECT user_id FROM profile_photos
        ) customers) AS customers,
        (SELECT COUNT(*) FROM profile_photos) AS photos,
        (SELECT COUNT(*) FROM assessment_results) AS assessments`,
      db`SELECT a.id, a.user_id AS "userId", a.kind,
        a.color_season AS "colorSeason", a.twelve_type AS "twelveType",
        a.color_type AS "colorType", a.style_type AS "styleType",
        a.body_type AS "bodyType", a.frame_type AS "frameType", a.bmi,
        a.created_at AS "createdAt",
        (SELECT COUNT(*) FROM profile_photos p WHERE p.user_id = a.user_id) AS "photoCount"
        FROM assessment_results a
        ORDER BY a.created_at DESC
        LIMIT 200`,
    ]);

    const stats = (statsRows as Array<Record<string, string | number>>)[0] ?? {};
    const records = (resultRows as Array<Record<string, unknown>>).map((row) => ({
      ...row,
      phone: displayPhone(String(row.userId ?? "")),
    }));

    return json({
      stats: {
        customers: Number(stats.customers ?? 0),
        photos: Number(stats.photos ?? 0),
        assessments: Number(stats.assessments ?? 0),
      },
      records,
    });
  } catch (error) {
    console.error("admin_records_failed", error);
    return json({ error: "后台记录暂时无法读取，请稍后重试。" }, 503);
  }
}

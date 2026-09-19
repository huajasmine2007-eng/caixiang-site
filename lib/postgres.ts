import { neon } from "@neondatabase/serverless";

let ready: Promise<void> | null = null;

export function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

export function ensureSchema() {
  if (!ready) {
    const db = sql();
    ready = (async () => {
      await db`CREATE TABLE IF NOT EXISTS assessment_results (
        id text PRIMARY KEY, user_id text NOT NULL, kind text NOT NULL,
        color_season text, twelve_type text, color_type text, style_type text,
        body_type text, frame_type text, bmi text, recommendations_json text,
        created_at bigint NOT NULL
      )`;
      await db`CREATE INDEX IF NOT EXISTS assessment_user_time ON assessment_results (user_id, created_at DESC)`;
      await db`CREATE TABLE IF NOT EXISTS profile_photos (
        id text PRIMARY KEY, user_id text NOT NULL, kind text NOT NULL,
        object_key text NOT NULL, filename text NOT NULL, content_type text NOT NULL,
        size bigint NOT NULL, created_at bigint NOT NULL
      )`;
      await db`CREATE INDEX IF NOT EXISTS profile_user_time ON profile_photos (user_id, created_at DESC)`;
      await db`CREATE TABLE IF NOT EXISTS products (
        id text PRIMARY KEY, brand text NOT NULL, sku text, name_ko text NOT NULL,
        name_zh text NOT NULL, category text NOT NULL, color_family text NOT NULL,
        season_tags text NOT NULL, body_tags text NOT NULL, frame_tags text NOT NULL,
        product_url text NOT NULL, image_url text, source text NOT NULL,
        is_active integer NOT NULL DEFAULT 1, updated_at bigint NOT NULL
      )`;
      await db`CREATE TABLE IF NOT EXISTS product_imports (
        id text PRIMARY KEY, user_id text NOT NULL, filename text NOT NULL,
        imported_count integer NOT NULL, created_at bigint NOT NULL
      )`;
      await db`CREATE TABLE IF NOT EXISTS appointments (
        id text PRIMARY KEY, user_id text NOT NULL, service_name text NOT NULL,
        contact_name text NOT NULL, contact_method text NOT NULL,
        preferred_date text NOT NULL, preferred_time text NOT NULL,
        city text NOT NULL, note text, status text NOT NULL DEFAULT 'pending',
        created_at bigint NOT NULL
      )`;
      await db`CREATE INDEX IF NOT EXISTS appointment_user_time ON appointments (user_id, created_at DESC)`;
    })().catch((error) => { ready = null; throw error; });
  }
  return ready;
}

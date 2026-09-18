import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const assessmentResults = sqliteTable("assessment_results", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  kind: text("kind").notNull(),
  colorSeason: text("color_season"),
  twelveType: text("twelve_type"),
  colorType: text("color_type"),
  styleType: text("style_type"),
  bodyType: text("body_type"),
  frameType: text("frame_type"),
  bmi: text("bmi"),
  recommendationsJson: text("recommendations_json"),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_assessment_results_user_created").on(table.userId, table.createdAt)]);

export const profilePhotos = sqliteTable("profile_photos", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  kind: text("kind").notNull(),
  objectKey: text("object_key").notNull(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_profile_photos_user_kind_created").on(table.userId, table.kind, table.createdAt)]);

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  brand: text("brand").notNull(),
  sku: text("sku"),
  nameKo: text("name_ko").notNull(),
  nameZh: text("name_zh").notNull(),
  category: text("category").notNull(),
  colorFamily: text("color_family").notNull(),
  seasonTags: text("season_tags").notNull(),
  bodyTags: text("body_tags").notNull(),
  frameTags: text("frame_tags").notNull(),
  productUrl: text("product_url").notNull(),
  imageUrl: text("image_url"),
  source: text("source").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [index("idx_products_active_category").on(table.isActive, table.category)]);

export const productImports = sqliteTable("product_imports", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  filename: text("filename").notNull(),
  importedCount: integer("imported_count").notNull(),
  createdAt: integer("created_at").notNull(),
});

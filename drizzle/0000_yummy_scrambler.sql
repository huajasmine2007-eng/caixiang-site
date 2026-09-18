CREATE TABLE `assessment_results` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`color_season` text,
	`twelve_type` text,
	`color_type` text,
	`style_type` text,
	`body_type` text,
	`frame_type` text,
	`bmi` text,
	`recommendations_json` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_imports` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`filename` text NOT NULL,
	`imported_count` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`brand` text NOT NULL,
	`sku` text,
	`name_ko` text NOT NULL,
	`name_zh` text NOT NULL,
	`category` text NOT NULL,
	`color_family` text NOT NULL,
	`season_tags` text NOT NULL,
	`body_tags` text NOT NULL,
	`frame_tags` text NOT NULL,
	`product_url` text NOT NULL,
	`image_url` text,
	`source` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profile_photos` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`object_key` text NOT NULL,
	`filename` text NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`created_at` integer NOT NULL
);

CREATE INDEX `idx_assessment_results_user_created` ON `assessment_results` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_products_active_category` ON `products` (`is_active`,`category`);--> statement-breakpoint
CREATE INDEX `idx_profile_photos_user_kind_created` ON `profile_photos` (`user_id`,`kind`,`created_at`);--> statement-breakpoint
PRAGMA optimize;

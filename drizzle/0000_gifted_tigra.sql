CREATE TABLE `buyer_history` (
	`id` text PRIMARY KEY NOT NULL,
	`buyer_id` text NOT NULL,
	`changed_by` text NOT NULL,
	`changed_at` integer DEFAULT (unixepoch()) NOT NULL,
	`diff` text NOT NULL,
	FOREIGN KEY (`buyer_id`) REFERENCES `buyers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`changed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `buyer_history_buyer_idx` ON `buyer_history` (`buyer_id`);--> statement-breakpoint
CREATE INDEX `buyer_history_changed_at_idx` ON `buyer_history` (`changed_at`);--> statement-breakpoint
CREATE TABLE `buyers` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`email` text,
	`phone` text NOT NULL,
	`city` text NOT NULL,
	`property_type` text NOT NULL,
	`bhk` text,
	`purpose` text NOT NULL,
	`budget_min` integer,
	`budget_max` integer,
	`timeline` text NOT NULL,
	`source` text NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`notes` text,
	`tags` text DEFAULT '[]',
	`owner_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `buyers_owner_idx` ON `buyers` (`owner_id`);--> statement-breakpoint
CREATE INDEX `buyers_status_idx` ON `buyers` (`status`);--> statement-breakpoint
CREATE INDEX `buyers_updated_at_idx` ON `buyers` (`updated_at`);--> statement-breakpoint
CREATE INDEX `buyers_city_idx` ON `buyers` (`city`);--> statement-breakpoint
CREATE INDEX `buyers_property_type_idx` ON `buyers` (`property_type`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`is_admin` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
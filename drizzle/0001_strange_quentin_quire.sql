CREATE TABLE `business_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`plan` enum('free','premium','premium_plus') NOT NULL DEFAULT 'free',
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`status` enum('active','past_due','canceled','unpaid','incomplete') DEFAULT 'active',
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`cancelAtPeriodEnd` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `business_subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `businesses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('cafe','roaster','both','equipment_seller') NOT NULL,
	`taxNumber` varchar(50),
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`address` json,
	`description` text,
	`logoUrl` varchar(512),
	`headerImageUrls` json,
	`website` varchar(512),
	`socialMedia` json,
	`openingHours` json,
	`services` json,
	`isVerified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `businesses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`netSalaryMin` int,
	`netSalaryMax` int,
	`contractType` enum('full-time','part-time','contract','internship','seasonal') NOT NULL,
	`workingHours` varchar(100),
	`startDate` date,
	`contactEmail` varchar(255) NOT NULL,
	`contactPhone` varchar(50),
	`requirements` json,
	`status` enum('draft','active','paused','expired','filled') DEFAULT 'draft',
	`views` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `job_listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `menu_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`order` int DEFAULT 0,
	CONSTRAINT `menu_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`currency` varchar(3) DEFAULT 'HUF',
	`image` varchar(512),
	`isVegan` boolean DEFAULT false,
	`isGlutenFree` boolean DEFAULT false,
	`allergens` json,
	`isAvailable` boolean DEFAULT true,
	CONSTRAINT `menu_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_promotions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`type` enum('single','category','all') NOT NULL,
	`targetProductIds` json,
	`targetCategory` json,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`dailyBudget` int,
	`totalBudget` int,
	`spent` int DEFAULT 0,
	`impressions` int DEFAULT 0,
	`clicks` int DEFAULT 0,
	`status` enum('active','paused','exhausted','expired') DEFAULT 'active',
	CONSTRAINT `product_promotions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`type` enum('coffee','equipment','accessory') NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`currency` varchar(3) DEFAULT 'HUF',
	`images` json,
	`roastLevel` enum('light','medium','medium-dark','dark'),
	`processMethod` enum('washed','natural','honey','anaerobic'),
	`origin` json,
	`flavorNotes` json,
	`weight` int,
	`roasterId` int,
	`isAvailable` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roasters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`logoUrl` varchar(512),
	`website` varchar(512),
	`isPartner` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `roasters_id` PRIMARY KEY(`id`),
	CONSTRAINT `roasters_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `business_subscriptions` ADD CONSTRAINT `business_subscriptions_businessId_businesses_id_fk` FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `businesses` ADD CONSTRAINT `businesses_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `job_listings` ADD CONSTRAINT `job_listings_businessId_businesses_id_fk` FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menu_categories` ADD CONSTRAINT `menu_categories_businessId_businesses_id_fk` FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menu_items` ADD CONSTRAINT `menu_items_categoryId_menu_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `menu_categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_promotions` ADD CONSTRAINT `product_promotions_businessId_businesses_id_fk` FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_businessId_businesses_id_fk` FOREIGN KEY (`businessId`) REFERENCES `businesses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_roasterId_roasters_id_fk` FOREIGN KEY (`roasterId`) REFERENCES `roasters`(`id`) ON DELETE no action ON UPDATE no action;
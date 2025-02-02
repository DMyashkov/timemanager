CREATE TABLE `dataIndex` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`type` text,
	`productive` integer,
	`lapName` text,
	`colorPreset` text,
	`parent` integer,
	`path` text,
	`children` text,
	`synced` integer DEFAULT 0,
	`deleted` integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS `tasks` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `title` TEXT,
    `description` TEXT,
    `date` TEXT,
    `activity_id` INTEGER,
    `project_id` INTEGER,
    `priority` INTEGER,
    `completed` INTEGER DEFAULT 0,
    `synced` INTEGER DEFAULT 0,
    `deleted` INTEGER DEFAULT 0,
    `tag_id` INTEGER
); 
-- Combined database schema for TimeManager

-- Tags table
CREATE TABLE IF NOT EXISTS `tags` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `title` TEXT,
    `module_type` TEXT,
    `productive` INTEGER,
    `lap_name` TEXT,
    `color_preset` TEXT,
    `parent` INTEGER,
    `children` TEXT NOT NULL,
    `synced` INTEGER DEFAULT 0,
    `deleted` INTEGER DEFAULT 0
);

-- Sessions table
CREATE TABLE IF NOT EXISTS `sessions` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `tag_id` INTEGER,
    `start_time` INTEGER,
    `end_time` INTEGER,
    `total_work_time` INTEGER,
    `total_break_time` INTEGER,
    `intervals` TEXT,
    `laps` TEXT,
    `synced` INTEGER DEFAULT 0,
    `deleted` INTEGER DEFAULT 0
);

-- Create index on start_time for better query performance
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time); 
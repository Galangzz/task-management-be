CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(30) NOT NULL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    detail TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deadline TIMESTAMP,
    has_date BOOLEAN NOT NULL DEFAULT false,
    has_time BOOLEAN NOT NULL DEFAULT false,
    starred BOOLEAN NOT NULL DEFAULT false,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    task_tabs_id VARCHAR(30) NOT NULL
);
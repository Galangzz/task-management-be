ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_task_tabs
Foreign Key (task_tabs_id) REFERENCES task_tabs(id)
ON DELETE CASCADE
ON UPDATE CASCADE;


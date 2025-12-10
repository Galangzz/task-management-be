const mapTaskTabsToModel = (rows) => ({
    id: rows[0].id,
    name: rows[0].name,
    created_at: rows[0].created_at,
    delete_permission: rows[0].delete_permission,
    tasks: rows
        .filter((r) => r.task_id)
        .map((row) => ({
            id: row.task_id,
            title: row.task_title,
            detail: row.task_detail,
            created_at: row.task_created_at,
            deadline: row.task_deadline,
            has_date: row.has_date,
            has_time: row.has_time,
            starred: row.starred,
            is_completed: row.is_completed,
        })),
});

module.exports = { mapTaskTabsToModel };

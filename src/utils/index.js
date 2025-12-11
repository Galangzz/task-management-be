const mapTaskTabsToModel = (rows) => ({
    id: rows[0].id,
    name: rows[0].name,
    createdAt: rows[0].created_at,
    deletePermission: rows[0].delete_permission,
    tasks: rows
        .filter((r) => r.task_id)
        .map((row) => ({
            id: row.task_id,
            title: row.task_title,
            detail: row.task_detail,
            createdAt: row.task_created_at,
            deadline: row.task_deadline,
            hasDate: row.has_date,
            hasTime: row.has_time,
            starred: row.starred,
            isCompleted: row.is_completed,
        })),
});

const mapTaskToModel = (row) => ({
    id: row.id,
    title: row.title,
    detail: row.detail,
    createdAt: row.created_at,
    deadline: row.deadline,
    hasDate: row.has_date,
    hasTime: row.has_time,
    starred: row.starred,
    isCompleted: row.is_completed,
});

const toMySQLDateTime = (date) => {
    if (!date) return null;

    try {
        const d = new Date(date);

        if (isNaN(d.getTime())) {
            throw new Error('Invalid date');
        }

        return d.toISOString().slice(0, 19).replace('T', ' ');
    } catch (error) {
        console.error('Date conversion error:', error);
        return null;
    }
};

module.exports = { mapTaskTabsToModel, toMySQLDateTime, mapTaskToModel };

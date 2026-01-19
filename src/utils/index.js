const mapTaskTabsToModel = (rows) => ({
    id: rows[0].id,
    name: rows[0].name,
    createdAt: rows[0].created_at,
    deletePermission: Boolean(rows[0].delete_permission),
    tasks: rows
        .filter((r) => r.task_id)
        .map((row) => ({
            id: row.task_id,
            title: row.task_title,
            detail: row.task_detail,
            createdAt: row.task_created_at,
            deadline: row.task_deadline,
            hasDate: Boolean(row.has_date),
            hasTime: Boolean(row.has_time),
            starred: Boolean(row.starred),
            isCompleted: Boolean(row.is_completed),
            taskTabId: row.task_tabs_id,
        })),
});

const mapTaskToModel = (row) => ({
    id: row.id,
    title: row.title,
    detail: row.detail,
    createdAt: row.created_at,
    deadline: row.deadline,
    hasDate: Boolean(row.has_date),
    hasTime: Boolean(row.has_time),
    starred: Boolean(row.starred),
    isCompleted: Boolean(row.is_completed),
    taskTabId: row.task_tabs_id,
});

const mapDeadlineToModel = (row) => ({
    title: row.title,
    deadline: row.deadline,
    userId: row.owner,
});

const toMySQLDateTime = (date) => {
    if (!date) return null;

    try {
        const d = new Date(date);

        if (isNaN(d.getTime())) {
            throw new Error('Invalid date');
        }
        const arrDate = d.toLocaleString('en-EN', { hour12: false }).replace(',', '').replaceAll('/', ' ').split(' ');
        const month = arrDate[0];
        const day = arrDate[1];
        const year = arrDate[2];
        const time = arrDate[3];

        return `${year}-${month}-${day} ${time}`;
    } catch (error) {
        console.error('Date conversion error:', error);
        return null;
    }
};

const mapTabToModel = (rows) => ({
    id: rows.id,
    name: rows.name,
    createdAt: rows.created_at,
    deletePermission: Boolean(rows.delete_permission),
});

module.exports = { mapTaskTabsToModel, toMySQLDateTime, mapTaskToModel, mapTabToModel, mapDeadlineToModel };

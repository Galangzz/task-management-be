const tasksController = require('../../controllers/tasksController');

// Mock dependencies
jest.mock('../../models/Task', () => ({
    getTasksByIdTab: jest.fn(),
    getTaskStarred: jest.fn(),
    addTaskModel: jest.fn(),
    updateTaskModel: jest.fn(),
    getTaskById: jest.fn(),
    deleteTaskById: jest.fn(),
    verifyTaskOwner: jest.fn(),
}));

jest.mock('../../models/Tab', () => ({
    verifyTabOwner: jest.fn(),
}));

const TaskModel = require('../../models/Task');
const TabModel = require('../../models/Tab');

describe('tasksController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            query: { tabId: 'tab-123' },
            body: {
                title: 'Test Task',
                detail: 'Test details',
                deadline: '2024-12-31T23:59:00Z',
                hasDate: true,
                hasTime: true,
                starred: false,
                isCompleted: false,
                taskTabId: 'tab-123',
            },
            params: { id: 'task-123' },
            user: { id: 'user-123' },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('getTasksController', () => {
        it('should return tasks for a specific tab', async () => {
            const mockTasks = [{ id: 'task-1', title: 'Task 1' }];
            TaskModel.getTasksByIdTab.mockResolvedValue(mockTasks);
            TabModel.verifyTabOwner.mockResolvedValue(true);

            await tasksController.getTasksController(req, res, next);

            expect(TabModel.verifyTabOwner).toHaveBeenCalledWith('tab-123', 'user-123');
            expect(TaskModel.getTasksByIdTab).toHaveBeenCalledWith('tab-123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Berhasil mendapatkan tugas',
                data: mockTasks,
            });
        });

        it('should return starred tasks when tabId is starred-task', async () => {
            req.query.tabId = 'starred-task';
            const mockStarredTasks = [{ id: 'task-1', starred: true }];
            TaskModel.getTaskStarred.mockResolvedValue(mockStarredTasks);

            await tasksController.getTasksController(req, res, next);

            expect(TaskModel.getTaskStarred).toHaveBeenCalledWith('user-123');
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Berhasil mendapatkan tugas',
                data: mockStarredTasks,
            });
        });
    });

    describe('postTaskController', () => {
        it('should create a new task successfully', async () => {
            const mockNewTask = { id: 'task-new', ...req.body };
            TabModel.verifyTabOwner.mockResolvedValue(true);
            TaskModel.addTaskModel.mockResolvedValue(mockNewTask);

            await tasksController.postTaskController(req, res, next);

            expect(TabModel.verifyTabOwner).toHaveBeenCalledWith('tab-123', 'user-123');
            expect(TaskModel.addTaskModel).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Tugas berhasil ditambahkan',
                data: mockNewTask,
            });
        });

        it('should throw error when addTaskModel returns null', async () => {
            TabModel.verifyTabOwner.mockResolvedValue(true);
            TaskModel.addTaskModel.mockResolvedValue(null);

            await expect(tasksController.postTaskController(req, res, next)).rejects.toThrow('Gagal menambahkan tugas');
        });
    });

    describe('patchTaskController', () => {
        it('should update task starred status', async () => {
            req.body = { starred: true };
            TaskModel.verifyTaskOwner.mockResolvedValue(true);
            TaskModel.updateTaskModel.mockResolvedValue('task-123');

            await tasksController.patchTaskController(req, res, next);

            expect(TaskModel.verifyTaskOwner).toHaveBeenCalledWith('task-123', 'user-123');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should update task completed status', async () => {
            req.body = { isCompleted: true };
            TaskModel.verifyTaskOwner.mockResolvedValue(true);
            TaskModel.updateTaskModel.mockResolvedValue('task-123');

            await tasksController.patchTaskController(req, res, next);

            expect(TaskModel.verifyTaskOwner).toHaveBeenCalledWith('task-123', 'user-123');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should throw error when no fields to update', async () => {
            req.body = {};

            await expect(tasksController.patchTaskController(req, res, next)).rejects.toThrow(
                'Tidak ada field yang diperbarui',
            );
        });
    });

    describe('putTaskController', () => {
        it('should update entire task', async () => {
            TaskModel.verifyTaskOwner.mockResolvedValue(true);
            TaskModel.updateTaskModel.mockResolvedValue('task-123');

            await tasksController.putTaskController(req, res, next);

            expect(TaskModel.verifyTaskOwner).toHaveBeenCalledWith('task-123', 'user-123');
            expect(TaskModel.updateTaskModel).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Tugas berhasil diperbaharui',
                data: { id: 'task-123' },
            });
        });
    });

    describe('getTaskByIdController', () => {
        it('should return task by id', async () => {
            const mockTask = { id: 'task-123', title: 'Test Task' };
            TaskModel.getTaskById.mockResolvedValue(mockTask);

            await tasksController.getTaskByIdController(req, res, next);

            expect(TaskModel.getTaskById).toHaveBeenCalledWith('task-123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: mockTask,
            });
        });
    });

    describe('deleteTaskByIdController', () => {
        it('should delete task successfully', async () => {
            TaskModel.verifyTaskOwner.mockResolvedValue(true);
            TaskModel.deleteTaskById.mockResolvedValue(true);

            await tasksController.deleteTaskByIdController(req, res, next);

            expect(TaskModel.verifyTaskOwner).toHaveBeenCalledWith('task-123', 'user-123');
            expect(TaskModel.deleteTaskById).toHaveBeenCalledWith('task-123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Tugas berhasil dihapus',
            });
        });

        it('should throw error when delete fails', async () => {
            TaskModel.verifyTaskOwner.mockResolvedValue(true);
            TaskModel.deleteTaskById.mockResolvedValue(null);

            await expect(tasksController.deleteTaskByIdController(req, res, next)).rejects.toThrow(
                'Gagal menghapus tugas',
            );
        });
    });
});

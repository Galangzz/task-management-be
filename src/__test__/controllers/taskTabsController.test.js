const taskTabsController = require('../../controllers/taskTabsController');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

// Mock dependencies
jest.mock('../../models/Tab', () => ({
    getTaskTabByName: jest.fn(),
    addTaskTab: jest.fn(),
    getTabById: jest.fn(),
    getTabByIdMainTask: jest.fn(),
    getTabs: jest.fn(),
    deleteTabById: jest.fn(),
    verifyTabOwner: jest.fn(),
    getDeletePermissionTaskTabs: jest.fn(),
}));

const TaskTabsModel = require('../../models/Tab');

describe('taskTabsController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                name: 'Test Tab',
            },
            params: { id: 'tab-123' },
            user: { id: 'user-123' },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('postTab', () => {
        it('should create a new tab successfully', async () => {
            const mockNewTab = { id: 'tab-new', name: 'Test Tab', createdAt: new Date().toISOString() };
            TaskTabsModel.getTaskTabByName.mockResolvedValue(null);
            TaskTabsModel.addTaskTab.mockResolvedValue(mockNewTab);

            await taskTabsController.postTab(req, res, next);

            expect(TaskTabsModel.getTaskTabByName).toHaveBeenCalledWith('Test Tab', 'user-123');
            expect(TaskTabsModel.addTaskTab).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Berhasil menambahkan task tab',
                data: expect.objectContaining({
                    id: expect.any(String),
                    name: 'Test Tab',
                    createdAt: expect.any(String),
                    deletePermission: true,
                }),
            });
        });

        it('should throw error when tab name already exists', async () => {
            TaskTabsModel.getTaskTabByName.mockResolvedValue({ id: 'existing-tab' });

            await expect(taskTabsController.postTab(req, res, next)).rejects.toThrow('Judul tidak boleh duplikat');
        });

        it('should throw error when addTaskTab returns null', async () => {
            TaskTabsModel.getTaskTabByName.mockResolvedValue(null);
            TaskTabsModel.addTaskTab.mockResolvedValue(null);

            await expect(taskTabsController.postTab(req, res, next)).rejects.toThrow('Gagal menambahkan task tab');
        });
    });

    describe('getTabById', () => {
        it('should return tab by id successfully', async () => {
            const mockTab = { id: 'tab-123', name: 'Test Tab' };
            TaskTabsModel.verifyTabOwner.mockResolvedValue(true);
            TaskTabsModel.getTabById.mockResolvedValue(mockTab);

            await taskTabsController.getTabById(req, res, next);

            expect(TaskTabsModel.verifyTabOwner).toHaveBeenCalledWith('tab-123', 'user-123');
            expect(TaskTabsModel.getTabById).toHaveBeenCalledWith('tab-123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Berhasil mengambil tab',
                data: mockTab,
            });
        });

        it('should return main task tab when id is main-task', async () => {
            req.params.id = 'main-task';
            const mockMainTab = { id: 'main-task', name: 'Main Task' };
            TaskTabsModel.getTabByIdMainTask.mockResolvedValue(mockMainTab);

            await taskTabsController.getTabById(req, res, next);

            expect(TaskTabsModel.getTabByIdMainTask).toHaveBeenCalledWith('main-task', 'user-123');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should throw error when tab not found', async () => {
            TaskTabsModel.verifyTabOwner.mockResolvedValue(true);
            TaskTabsModel.getTabById.mockResolvedValue(null);

            await expect(taskTabsController.getTabById(req, res, next)).rejects.toThrow('Task tab tidak ditemukan');
        });
    });

    describe('getTabs', () => {
        it('should return all tabs for user', async () => {
            const mockTabs = [
                { id: 'tab-1', name: 'Tab 1' },
                { id: 'tab-2', name: 'Tab 2' },
            ];
            TaskTabsModel.getTabs.mockResolvedValue(mockTabs);

            await taskTabsController.getTabs(req, res, next);

            expect(TaskTabsModel.getTabs).toHaveBeenCalledWith('user-123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: mockTabs,
            });
        });
    });

    describe('deleteTabById', () => {
        it('should delete tab successfully when permission is true', async () => {
            TaskTabsModel.verifyTabOwner.mockResolvedValue(true);
            TaskTabsModel.getDeletePermissionTaskTabs.mockResolvedValue(true);
            TaskTabsModel.deleteTabById.mockResolvedValue(true);

            await taskTabsController.deleteTabById(req, res, next);

            expect(TaskTabsModel.verifyTabOwner).toHaveBeenCalledWith('tab-123', 'user-123');
            expect(TaskTabsModel.getDeletePermissionTaskTabs).toHaveBeenCalledWith('tab-123');
            expect(TaskTabsModel.deleteTabById).toHaveBeenCalledWith('tab-123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Task tab berhasil dihapus',
            });
        });

        it('should return 403 when delete permission is false', async () => {
            TaskTabsModel.verifyTabOwner.mockResolvedValue(true);
            TaskTabsModel.getDeletePermissionTaskTabs.mockResolvedValue(false);

            await taskTabsController.deleteTabById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Task tab tidak bisa dihapus',
            });
        });

        it('should throw error when deleteTabById returns false', async () => {
            TaskTabsModel.verifyTabOwner.mockResolvedValue(true);
            TaskTabsModel.getDeletePermissionTaskTabs.mockResolvedValue(true);
            TaskTabsModel.deleteTabById.mockResolvedValue(false);

            await expect(taskTabsController.deleteTabById(req, res, next)).rejects.toThrow('Gagal menghapus task tab');
        });
    });
});

const authController = require('../../controllers/authController');

// Mock dependencies
jest.mock('../../models/authModel', () => ({
    addRefreshToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
    deleteRefreshToken: jest.fn(),
}));

jest.mock('../../models/User', () => ({
    verifyUserCredentials: jest.fn(),
    getUserData: jest.fn(),
}));

jest.mock('../../utils/tokenize/TokenManager', () => ({
    generateAccessToken: jest.fn().mockReturnValue('mock-access-token'),
    generateRefreshToken: jest.fn().mockReturnValue('mock-refresh-token'),
    verifyRefreshToken: jest.fn().mockReturnValue({ id: 'user-123' }),
}));

const AuthModel = require('../../models/authModel');
const UserModel = require('../../models/User');
const token = require('../../utils/tokenize/TokenManager');

describe('authController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: { email: 'test@example.com', password: 'password123' },
            cookies: { jwt: 'mock-refresh-token' },
            user: { id: 'user-123' },
        };
        res = {
            cookie: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            clearCookie: jest.fn().mockReturnThis(),
            sendStatus: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('postAuthController', () => {
        it('should login successfully and return access token', async () => {
            UserModel.verifyUserCredentials.mockResolvedValue('user-123');
            AuthModel.addRefreshToken.mockResolvedValue(true);

            await authController.postAuthController(req, res, next);

            expect(UserModel.verifyUserCredentials).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(token.generateAccessToken).toHaveBeenCalledWith({ id: 'user-123' });
            expect(token.generateRefreshToken).toHaveBeenCalledWith({ id: 'user-123' });
            expect(AuthModel.addRefreshToken).toHaveBeenCalledWith('user-123', 'mock-refresh-token');
            expect(res.cookie).toHaveBeenCalledWith('jwt', 'mock-refresh-token', expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Login berhasil',
                data: { accessToken: 'mock-access-token' },
            });
        });

        it('should throw error on invalid credentials', async () => {
            UserModel.verifyUserCredentials.mockRejectedValue(new Error('Invalid credentials'));

            await expect(authController.postAuthController(req, res, next)).rejects.toThrow('Invalid credentials');
        });
    });

    describe('getNewAccessToken', () => {
        it('should return new access token on valid refresh token', async () => {
            AuthModel.verifyRefreshToken.mockResolvedValue(true);

            await authController.getNewAccessToken(req, res, next);

            expect(AuthModel.verifyRefreshToken).toHaveBeenCalledWith('mock-refresh-token');
            expect(token.generateAccessToken).toHaveBeenCalledWith({ id: 'user-123' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Access token berhasil diperbaharui ',
                data: { accessToken: 'mock-access-token' },
            });
        });

        it('should clear cookie and call next on invalid refresh token', async () => {
            AuthModel.verifyRefreshToken.mockRejectedValue(new Error('Invalid token'));

            await authController.getNewAccessToken(req, res, next);

            expect(res.clearCookie).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });

    describe('deleteAuthController', () => {
        it('should logout successfully', async () => {
            AuthModel.verifyRefreshToken.mockResolvedValue(true);
            AuthModel.deleteRefreshToken.mockResolvedValue(true);

            await authController.deleteAuthController(req, res, next);

            expect(AuthModel.verifyRefreshToken).toHaveBeenCalledWith('mock-refresh-token');
            expect(AuthModel.deleteRefreshToken).toHaveBeenCalledWith('mock-refresh-token');
            expect(res.clearCookie).toHaveBeenCalled();
            expect(res.sendStatus).toHaveBeenCalledWith(204);
        });
    });

    describe('getMe', () => {
        it('should return current user data', async () => {
            UserModel.getUserData.mockResolvedValue({
                id: 'user-123',
                username: 'testuser',
                email: 'test@example.com',
            });

            await authController.getMe(req, res, next);

            expect(UserModel.getUserData).toHaveBeenCalledWith('user-123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: {
                    id: 'user-123',
                    username: 'testuser',
                    email: 'test@example.com',
                },
            });
        });

        it('should return null if user not found', async () => {
            UserModel.getUserData.mockResolvedValue(null);

            await authController.getMe(req, res, next);

            expect(res.json).toHaveBeenCalledWith({
                data: null,
            });
        });
    });
});

const Joi = require('joi');
const { validate } = require('../../middlewares/validate');

describe('validate Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            query: {},
            params: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('when validation passes', () => {
        it('should call next() when body is valid', () => {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required(),
            });

            req.body = { email: 'test@example.com', password: 'password123' };

            validate(schema, 'body')(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should call next() when query is valid', () => {
            const schema = Joi.object({
                page: Joi.number().integer().min(1).default(1),
                limit: Joi.number().integer().min(1).max(100).default(10),
            });

            req.query = { page: '1', limit: '10' };

            validate(schema, 'query')(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should call next() when params is valid', () => {
            const schema = Joi.object({
                id: Joi.string().alphanum().required(),
            });

            req.params = { id: 'abc123' };

            validate(schema, 'params')(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('when validation fails', () => {
        it('should return 400 with error details for invalid body', () => {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required(),
            });

            req.body = { email: 'invalid-email' };

            validate(schema, 'body')(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Validation error',
                errors: expect.any(Array),
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 400 for missing required fields', () => {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required(),
            });

            req.body = {};

            validate(schema, 'body')(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 for invalid query parameters', () => {
            const schema = Joi.object({
                page: Joi.number().integer().min(1).required(),
            });

            req.query = { page: 'invalid' };

            validate(schema, 'query')(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('with custom error message', () => {
        it('should use custom validation schema with messages', () => {
            const schema = Joi.object({
                email: Joi.string().email().required(),
            }).messages({
                'string.email': 'Format email tidak valid',
                'any.required': 'Email wajib diisi',
            });

            req.body = { email: 'invalid' };

            validate(schema, 'body')(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Validation error',
                errors: expect.any(Array),
            });
        });
    });
});

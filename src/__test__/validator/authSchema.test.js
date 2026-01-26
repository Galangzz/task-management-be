const { postAuthSchema, putAuthSchema } = require('../../validator/authSchema');

describe('Auth Schema Validation', () => {
    describe('postAuthSchema (login validation)', () => {
        it('should validate correct login data', () => {
            const data = {
                email: 'test@example.com',
                password: 'password123',
            };

            const { error } = postAuthSchema.validate(data);
            expect(error).toBeUndefined();
        });

        it('should reject invalid email format', () => {
            const data = {
                email: 'invalid-email',
                password: 'password123',
            };

            const { error } = postAuthSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].path).toContain('email');
        });

        it('should reject missing email', () => {
            const data = {
                password: 'password123',
            };

            const { error } = postAuthSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].path).toContain('email');
        });

        it('should reject missing password', () => {
            const data = {
                email: 'test@example.com',
            };

            const { error } = postAuthSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].path).toContain('password');
        });

        it('should reject empty email', () => {
            const data = {
                email: '',
                password: 'password123',
            };

            const { error } = postAuthSchema.validate(data);
            expect(error).toBeDefined();
        });

        it('should reject empty password', () => {
            const data = {
                email: 'test@example.com',
                password: '',
            };

            const { error } = postAuthSchema.validate(data);
            expect(error).toBeDefined();
        });

        it('should accept various valid email formats', () => {
            const validEmails = [
                'user@example.com',
                'user.name@example.com',
                'user+tag@example.com',
                'user@subdomain.example.com',
            ];

            validEmails.forEach((email) => {
                const data = { email, password: 'password123' };
                const { error } = postAuthSchema.validate(data);
                expect(error).toBeUndefined();
            });
        });
    });

    describe('putAuthSchema (cookie validation)', () => {
        it('should validate correct cookie data', () => {
            const data = {
                jwt: 'valid-refresh-token',
            };

            const { error } = putAuthSchema.validate(data);
            expect(error).toBeUndefined();
        });

        it('should reject missing jwt cookie', () => {
            const data = {};

            const { error } = putAuthSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].path).toContain('jwt');
        });

        it('should reject empty jwt cookie', () => {
            const data = {
                jwt: '',
            };

            const { error } = putAuthSchema.validate(data);
            expect(error).toBeDefined();
        });
    });
});

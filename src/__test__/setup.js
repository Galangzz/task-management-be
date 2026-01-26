// // Jest Test Setup File
// // This file runs before all tests

// // Set test environment variables
// process.env.JWT_ACCESS_SECRET = 'test-access-secret-key-for-jest-testing';
// process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-jest-testing';
// process.env.PORT = '3001';
// process.env.HOST = 'localhost';

// // Mock console.log and console.error during tests to reduce noise
// const originalConsoleLog = console.log;
// const originalConsoleError = console.error;

// beforeAll(() => {
//     console.log = jest.fn();
//     console.error = jest.fn();
// });

// afterAll(() => {
//     console.log = originalConsoleLog;
//     console.error = originalConsoleError;
// });

// // Global test timeout
// jest.setTimeout(10000);

// This file runs before all tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DB_HOST = 'localhost';
OPENAI_API_KEY = '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'



// Set a global timeout for all tests
jest.setTimeout(60000);

// Silence console logs during tests
global.console = {
  log: jest.fn(), // console.log are ignored in tests
  error: jest.fn(), // console.error are ignored in tests
  warn: jest.fn(), // console.warn are ignored in tests
  info: jest.fn(), // console.info are ignored in tests
  debug: jest.fn(), // console.debug are ignored in tests
};

// Add any global test setup here
beforeAll(async () => {
  // Add any setup that needs to run before all tests
  // For example: database connection, test data setup, etc.
});

afterAll(async () => {
  // Add any cleanup that needs to run after all tests
  // For example: closing database connections, cleaning test data, etc.
}); 

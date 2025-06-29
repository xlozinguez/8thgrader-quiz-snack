// Basic Jest setup for React Native
// Mock console to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
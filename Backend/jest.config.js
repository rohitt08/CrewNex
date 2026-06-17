module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
  testTimeout: 30000,
  detectOpenHandles: true,
  forceExit: true,
};

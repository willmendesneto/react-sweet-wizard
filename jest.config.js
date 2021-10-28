// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

// eslint-disable-next-line no-undef
module.exports = {
  // The directory where Jest should store its cached dependency information
  cacheDirectory: '<rootDir>/.jest',
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['**/src/*.{ts,tsx}', '!src/index.ts'],
  // The directory where Jest should output its coverage files
  coverageDirectory: './coverage/',
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['lcov', 'html', 'text-summary'],
  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 87,
      functions: 100,
      lines: 92,
      statements: 92,
    },
  },
  // A preset that is used as a base for Jest's configuration
  preset: null,
  // Automatically reset mock state between every test
  resetMocks: true,
  // The paths to modules that runs some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['<rootDir>jest.setup.js'],
  // The glob patterns Jest uses to detect test files
  testMatch: ['<rootDir>/**/__tests__/**/*.(js|tsx|ts)'],
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['/node_modules/', '/scripts/', '/dist/'],
};

/**
 * Configuration for the jest testing framework.
 * @see https://jestjs.io/docs/en/cli.html
 * @file
 */

const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, '..'),
  coverageDirectory: 'coverage',
  collectCoverage: false,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 96,
      lines: 96,
      statements: 95,
    },
  },
  coverageReporters: ['json', 'html', 'text', 'text-summary'],
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/.*index.js',
    '<rootDir>/src/.*App.js',
    '<rootDir>/src/.*Routes.js',
    // ignore files that start with capital letters under assumption that we are removing
    // react components from our coverage percentage...basically this matches anywhere there
    // is a file path that ends in /{first letter is capital}{rest of filename}.js that is
    // located in the source directory.
    '<rootDir>/src.*/[A-Z].*.js',
  ],
  setupFiles: ['jest-localstorage-mock'],
  setupFilesAfterEnv: ['<rootDir>/test-setup.js', 'jest-extended'],
  testMatch: ['<rootDir>/__tests__/**/*.js?(x)', '<rootDir>/src/**/?(*.)(spec|test).js?(x)'],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/config/jest.preprocess.js',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  moduleFileExtensions: ['web.js', 'js', 'json', 'web.jsx', 'jsx', 'node'],
  moduleNameMapper: {
    '\\.(css|jpg|png|svg)$': '<rootDir>/__mocks__/empty-module.js',
    'ace-builds': '<rootDir>/node_modules/ace-builds',
  },
};

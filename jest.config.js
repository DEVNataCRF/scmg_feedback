/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.jest.json' }],
  },
  setupFiles: ['jest-localstorage-mock'],
  testPathIgnorePatterns: ['<rootDir>/backend/'],
};

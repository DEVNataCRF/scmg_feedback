/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest", { tsconfig: "backend/tsconfig.json" }],
  },
  setupFiles: ['jest-localstorage-mock'],
};
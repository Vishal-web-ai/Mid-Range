/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>"],
  testMatch: ["**/__tests__/**/*.{ts,tsx}", "**/*.test.{ts,tsx}"],
  testPathIgnorePatterns: ["/node_modules/", "/tests/", "/playwright-report/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
};

export default config;

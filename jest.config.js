// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/hooks/",
    "<rootDir>/components/ui/",
    "context/UserDetailContext.jsx",
    "lib/utils.js",
    "<rootDir>/services/",
  ],
};

module.exports = createJestConfig(customJestConfig);

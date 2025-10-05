const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // ✅ Add coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,     // % of branch coverage required
      functions: 80,    // % of functions tested
      lines: 80,        // % of lines tested
      statements: 80,   // % of statements tested
    },
  },

  // Optional: ignore node_modules and Next.js build folders from coverage
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/hooks/",
    "<rootDir>/components/ui/",
    "context/UserDetailContext.jsx",
    "lib/utils.js",
    "<>rootDir>/services"
  ],
};

module.exports = createJestConfig(customJestConfig);

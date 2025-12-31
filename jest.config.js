// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
"coverageThreshold": {
  "global": {
    "branches": 50,
    "functions": 50,
    "lines": 50,
    "statements": 50
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
   // ✅ Ignore the test file itself
  testPathIgnorePatterns: [
    "/node_modules/",
  ],
  transformIgnorePatterns: [
  "node_modules/(?!@vercel/speed-insights)" // ✅ allow Jest to safely skip/transform that package
],
};

module.exports = createJestConfig(customJestConfig);

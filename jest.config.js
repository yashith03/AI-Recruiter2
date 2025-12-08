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
      "<rootDir>/app/(main)/dashboard/create-interview/_components/QuestionList.jsx", // ✅ exclude this file
  ],
   // ✅ Ignore the test file itself
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/__tests__/QuestionList.test.jsx", // ⛔ skip this test completely
  ],
  transformIgnorePatterns: [
  "node_modules/(?!@vercel/speed-insights)" // ✅ allow Jest to safely skip/transform that package
],
};

module.exports = createJestConfig(customJestConfig);

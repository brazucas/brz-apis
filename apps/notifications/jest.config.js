const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  testRegex: "(/test/.*|(\\.|/)(test))\\.(ts|js)x?$",
  testPathIgnorePatterns: [],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}",
    "!src/app.ts",
    "!src/index.ts",
  ],
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/src/$1",
  },
  modulePathIgnorePatterns: [],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>",
  }),
};

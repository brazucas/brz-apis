const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  testRegex: "(/test/.*|(\\.|/)(test))\\.(ts|js)x?$",
  testPathIgnorePatterns: ["./test/mocks/"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}",
    "!src/app.ts",
    "!src/index.ts",
    "!src/tracer.ts",
    "!src/lambda.ts",
  ],
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/src/$1",
    "@test/(.*)$": "<rootDir>/test/$1",
  },
  modulePathIgnorePatterns: ["__fixtures__"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>",
  }),
};

import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".*\\.(test|spec)\\.ts$",
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.spec.json"
      }
    ]
  },
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1"
  }
};

export default config;

import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".", // Ensures paths start from the root directory
  testMatch: ["<rootDir>/__test/**/*.test.ts"], // Matches all .test.ts files in the __test directory
  moduleFileExtensions: ["ts", "js", "json"],
};

export default config;

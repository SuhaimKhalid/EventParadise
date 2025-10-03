import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".", // ensures paths start from back-end folder
  testMatch: ["<rootDir>/tests/**/*.test.ts"], // looks inside tests folder for *.test.ts
  moduleFileExtensions: ["ts", "js", "json"],
};

export default config;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const ENV = process.env.NODE_ENV || "development";
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, `../../.env.${ENV}`),
});
const config = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
};
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
}
if (process.env.DATABASE_URL) {
    config.connectionString = process.env.DATABASE_URL;
    // Apply SSL only in production
    if (ENV === "production") {
        config.ssl = { rejectUnauthorized: false };
        config.max = 2;
    }
}
const db = new pg_1.Pool(config);
exports.default = db;

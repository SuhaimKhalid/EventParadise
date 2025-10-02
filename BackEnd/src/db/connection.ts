import { Pool, PoolConfig } from "pg";
import path from "path";
import dotenv from "dotenv";

const ENV = process.env.NODE_ENV || "development";

// Load the right .env file (e.g., .env.development, .env.test)
dotenv.config({
  path: path.resolve(__dirname, `../../.env.${ENV}`),
});

const config: PoolConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : undefined,
};

// If DATABASE_URL exists, prefer it (useful in production/hosting)
if (process.env.DATABASE_URL) {
  config.connectionString = process.env.DATABASE_URL;
  config.ssl = { rejectUnauthorized: false };
}

const db = new Pool(config);

export default db;

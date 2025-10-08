import { Pool, PoolConfig } from "pg";
import path from "path";
import dotenv from "dotenv";

const ENV = process.env.NODE_ENV || "development";

dotenv.config({
  path: path.resolve(__dirname, `../../.env.${ENV}`),
});

const config: PoolConfig = {
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

const db = new Pool(config);

export default db;

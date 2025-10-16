import app from "./api";
import dotenv from "dotenv";
import db from "./db/connection";
import seed from "./db/seeds/seeds";
import data from "./db/Development-Data/development_Data";

dotenv.config();

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 9090;

(async () => {
  try {
    console.log("Running database seed/migration...");
    await seed(data);
    console.log("Database ready.");
  } catch (err) {
    console.error("Error seeding/migrating database:", err);
  }

  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
  });
})();

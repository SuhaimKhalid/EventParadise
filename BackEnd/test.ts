import db from "./src/db/connection";

(async () => {
  try {
    const result = await db.query("SELECT NOW()");
    console.log(result.rows);
  } catch (err) {
    console.error("Database connection failed:", err);
  } finally {
    await db.end();
  }
})();

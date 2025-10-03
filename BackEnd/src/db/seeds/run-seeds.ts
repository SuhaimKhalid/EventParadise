import index from "../Development-Data/development_Data";
import seed from "./seeds";
import db from "../connection";

const runSeed = async (): Promise<void> => {
  try {
    await seed(index);
  } catch (err) {
    console.error("Seeding Error:", err);
  } finally {
    await db.end();
  }
};
runSeed();

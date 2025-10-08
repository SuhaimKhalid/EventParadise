import app from "./api";
import dotenv from "dotenv";

dotenv.config();

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 9090;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});

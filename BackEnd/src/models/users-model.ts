import db from "../db/connection";

// Define a User type (adapt this to match your DB schema)
export interface User {
  user_id: number;
  name: string;
  email: string;
  password: string;
  role: "staff" | "member";
  created_at: Date;
  // add any other fields you actually have in your "users" table
}

export const selectAllUsers = async (): Promise<User[]> => {
  const result = await db.query<User>("SELECT * FROM users");
  return result.rows;
};

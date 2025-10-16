import { registerUser } from "../controllers/users-Controller";
import db from "../db/connection";
import bcrypt from "bcrypt";
// Define a User type (adapt this to match your DB schema)
export interface User {
  user_id: number;
  name: string;
  email: string;
  password: string;
  role: "staff" | "member";
  created_at: Date;
}

export const selectAllUsers = async (): Promise<User[]> => {
  const result = await db.query<User>("SELECT * FROM users");
  return result.rows;
};

export const selectSingleUser = async (user_id: number): Promise<User> => {
  const result = await db.query<User>("SELECT * FROM users WHERE user_id=$1", [
    user_id,
  ]);

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  return result.rows[0];
};

export const updateUserByID = async (
  user_id: number,
  updateData: Partial<User>
): Promise<User> => {
  const field = Object.keys(updateData);
  const values = Object.values(updateData);
  if (field.length <= 0) {
    throw { status: 400, msg: "No update data provided" };
  }
  const setClause = field
    .map((field, index) => `${field}= $${index + 1}`)
    .join(", ");

  const result = await db.query<User>(
    `UPDATE users SET ${setClause} WHERE user_id=$${
      field.length + 1
    } RETURNING *;`,
    [...values, user_id]
  );
  if (result.rows.length === 0) {
    throw { status: 404, msg: "User not found" };
  }
  return result.rows[0];
};

export const insertUser = async (
  registerUser: Partial<User>
): Promise<User> => {
  const { name, email, password, role } = registerUser;

  if (!name || !email || !password) {
    throw { status: 400, msg: "Name, email, and password are required" };
  }

  const assignedRole = role || "member";

  const hashedPassword = await bcrypt.hash(password!, 10);

  const result = await db.query<User>(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING user_id, name, email, role, created_at`,
    [name, email, hashedPassword, assignedRole]
  );

  return result.rows[0];
};

export const getUserByEmail = async (email: string) => {
  const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0];
};

import { Request, Response, NextFunction } from "express";
import {
  selectAllUsers,
  selectSingleUser,
  updateUserByID,
  User,
  insertUser,
  getUserByEmail,
} from "../models/users-model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await selectAllUsers();
    res.status(200).json({ users: result });
  } catch (err) {
    next(err);
  }
};

export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user_id = Number(req.params.user_id);

    if (isNaN(user_id) || user_id <= 0) {
      res.status(400).json({ msg: "Invalid user ID" });
      return;
    }
    const result = await selectSingleUser(user_id);
    res.status(200).json({ user: result });
  } catch (err) {
    next(err);
  }
};

export const patchUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user_id = Number(req.params.user_id);
    if (isNaN(user_id)) {
      res.status(400).json({ msg: "Invalid user ID" });
      return;
    }

    const updateData: Partial<User> = req.body;

    if (
      updateData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)
    ) {
      res.status(400).json({ msg: "Invalid email format" });
      return;
    }

    const result = await updateUserByID(user_id, updateData);
    res.status(200).json({ user: result });
  } catch (err: any) {
    // Handle PostgreSQL unique constraint violation
    if (err.code === "23505") {
      res.status(409).json({ msg: "Email already in use" });
      return;
    }
    next(err);
  }
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const registerData: Partial<User> = req.body;

    const { name, email, password, role } = registerData;

    if (!name || !email || !password) {
      res.status(400).json({ msg: "Name, email and password are required" });
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ msg: "Invalid email format" });
      return;
    }

    // Default role is "member" if not provided
    const userRole = role || "member";

    const result = await insertUser({ name, email, password, role: userRole });

    res.status(201).json({ user: result });
  } catch (err: any) {
    if (err.code === "23505") {
      res.status(409).json({ msg: "Email already in use" });
      return;
    }
    next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ msg: "Email and password are required" });
      return;
    }

    const user = await getUserByEmail(email);

    if (!user) {
      res.status(401).json({ msg: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ msg: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

import { Request, Response, NextFunction } from "express";
import {
  selectAllUsers,
  selectSingleUser,
  updateUserByID,
  User,
} from "../models/users-model";

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

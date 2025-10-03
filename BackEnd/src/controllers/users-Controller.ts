import { Request, Response, NextFunction } from "express";
import { selectAllUsers } from "../models/users-model";
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

import { Request, Response, NextFunction } from "express";
import { insertEmailLog, selectEmailById } from "../models/emails-model";

export const sendEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user_id, event_id, status } = req.body;

    if (!user_id || !event_id) {
      res.status(400).json({ msg: "user_id and event_id are required" });
      return;
    }

    const emailLog = await insertEmailLog({ user_id, event_id, status });

    res.status(201).json({ emailLog });
  } catch (err) {
    next(err);
  }
};

export const getEmailStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const email_id = Number(req.params.id);
    if (isNaN(email_id) || email_id <= 0) {
      res.status(400).json({ msg: "Invalid email ID" });
      return;
    }

    const emailLog = await selectEmailById(email_id);
    res.status(200).json({ emailLog });
  } catch (err) {
    next(err);
  }
};

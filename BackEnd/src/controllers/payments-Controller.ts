import { Request, Response, NextFunction } from "express";
import {
  selectPaymentById,
  selectPaymentsByUser,
  insertPayment,
} from "../models/payments-model";

export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user_id, event_id, amount } = req.body;

    if (!user_id || !event_id || !amount) {
      res
        .status(400)
        .json({ msg: "user_id, event_id and amount are required" });
      return;
    }

    const payment = await insertPayment({
      user_id,
      event_id,
      amount,
      status: "pending",
    });

    res.status(201).json({ payment });
  } catch (err) {
    next(err);
  }
};

export const getPaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payment_id = Number(req.params.id);
    if (isNaN(payment_id) || payment_id <= 0) {
      res.status(400).json({ msg: "Invalid payment ID" });
      return;
    }

    const payment = await selectPaymentById(payment_id);
    res.status(200).json({ payment });
  } catch (err) {
    next(err);
  }
};

export const getUserPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user_id = Number(req.params.id);
    if (isNaN(user_id) || user_id <= 0) {
      res.status(400).json({ msg: "Invalid user ID" });
      return;
    }

    const payments = await selectPaymentsByUser(user_id);
    res.status(200).json({ payments });
  } catch (err) {
    next(err);
  }
};

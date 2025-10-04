import { Request, Response, NextFunction } from "express";
import {
  selectAllEvents,
  selectSingleEvent,
  updateEvent,
} from "../models/events-model";
import { Event } from "../db/tableTypes";

export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await selectAllEvents();
    res.status(200).json({ events: result });
  } catch (err) {
    next(err);
  }
};

export const getSingleEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event_id = Number(req.params.event_id);

    if (isNaN(event_id) || event_id <= 0) {
      res.status(400).json({ msg: "Invalid Event ID" });
      return;
    }

    const result = await selectSingleEvent(event_id);

    res.status(200).json({ event: result });
  } catch (err) {
    next(err);
  }
};

export const patchEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event_id = Number(req.params.event_id);
    const UpdateEventData: Partial<Event> = req.body;

    if (isNaN(event_id) || event_id <= 0) {
      res.status(400).json({ msg: "Invalid Event ID" });
      return;
    }
    const result = await updateEvent(event_id, UpdateEventData);
    res.status(200).json({ event: result });
  } catch (err) {
    next(err);
  }
};

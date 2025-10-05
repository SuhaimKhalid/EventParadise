import { Request, Response, NextFunction } from "express";
import { selectEventAttendees, selectUserEvents } from "../models/events-model";

// export const getEventMembers = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     // Assuming list all event members, but perhaps not needed
//     res.status(200).json({ msg: "Not implemented" });
//   } catch (err) {
//     next(err);
//   }
// };

export const getEventAttendees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event_id = Number(req.params.id);
    if (isNaN(event_id) || event_id <= 0) {
      res.status(400).json({ msg: "Invalid event ID" });
      return;
    }

    const attendees = await selectEventAttendees(event_id);
    res.status(200).json({ attendees });
  } catch (err) {
    next(err);
  }
};

export const getUserEvents = async (
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

    const events = await selectUserEvents(user_id);
    res.status(200).json({ events });
  } catch (err) {
    next(err);
  }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserEvents = exports.getEventAttendees = void 0;
const events_model_1 = require("../models/events-model");
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
const getEventAttendees = async (req, res, next) => {
    try {
        const event_id = Number(req.params.id);
        if (isNaN(event_id) || event_id <= 0) {
            res.status(400).json({ msg: "Invalid event ID" });
            return;
        }
        const attendees = await (0, events_model_1.selectEventAttendees)(event_id);
        res.status(200).json({ attendees });
    }
    catch (err) {
        next(err);
    }
};
exports.getEventAttendees = getEventAttendees;
const getUserEvents = async (req, res, next) => {
    try {
        const user_id = Number(req.params.id);
        if (isNaN(user_id) || user_id <= 0) {
            res.status(400).json({ msg: "Invalid user ID" });
            return;
        }
        const events = await (0, events_model_1.selectUserEvents)(user_id);
        res.status(200).json({ events });
    }
    catch (err) {
        next(err);
    }
};
exports.getUserEvents = getUserEvents;

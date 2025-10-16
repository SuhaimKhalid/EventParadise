import {
  getAllUsers,
  getSingleUser,
  patchUser,
  registerUser,
  loginUser,
} from "./controllers/users-Controller";

import {
  getAllEvents,
  getSingleEvent,
  patchEvent,
  addEvent,
  deleteEventByID,
  joinEventByID,
  getEventsCreatedByUser,
} from "./controllers/events-Controller";
import express, { Application, Request, Response, NextFunction } from "express";
import { requireStaff, requireAuth } from "./middlewares/auth";
import cors from "cors";

import {
  getEventAttendees,
  getUserEvents,
} from "./controllers/event-Members-Controller";
import {
  createPayment,
  getPaymentStatus,
  getUserPayments,
} from "./controllers/payments-Controller";
import { sendEmail, getEmailStatus } from "./controllers/emails-Controller";
const app: Application = express();

app.use(cors()); // Allow CORS for frontend
app.use(express.json()); // Parse incoming JSON requests

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const msg = err.msg || "Internal Server Error";
  res.status(status).json({ msg });
});

// Users EndPoints
app.get("/api/users", getAllUsers);
app.get("/api/users/:user_id", getSingleUser);
app.get(
  "/api/users/:user_id/created-events",
  requireStaff,
  getEventsCreatedByUser
);
app.patch("/api/users/:user_id", patchUser);
app.post("/api/auth/register", registerUser);
app.post("/api/auth/login", loginUser);

// Event EndPoints
app.get("/api/events", getAllEvents);
app.get("/api/events/:event_id", getSingleEvent);
app.patch("/api/events/:event_id", requireStaff, patchEvent);
app.post("/api/events", requireStaff, addEvent);
app.post("/api/events/:event_id/register", requireAuth, joinEventByID);
app.delete("/api/events/:event_id", requireStaff, deleteEventByID);

// Event Members EndPoints
app.get("/api/events/:id/attendees", requireStaff, getEventAttendees);
app.get("/api/users/:id/events", getUserEvents);

// Payments EndPoints
app.post("/api/payments/create", requireAuth, createPayment);
app.get("/api/payments/:id", getPaymentStatus);
app.get("/api/users/:id/payments", getUserPayments);

// Emails EndPoints
app.post("/api/emails/send", sendEmail);
app.get("/api/emails/:id", getEmailStatus);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.status && err.msg) {
    res.status(err.status).json({ msg: err.msg });
  } else if (err.status && err.message) {
    res.status(err.status).json({ msg: err.message });
  } else {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

export default app;

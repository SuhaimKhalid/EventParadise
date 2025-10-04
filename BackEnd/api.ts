import {
  getAllUsers,
  getSingleUser,
  patchUser,
  registerUser,
  loginUser,
} from "./src/controllers/users-Controller";

import {
  getAllEvents,
  getSingleEvent,
  patchEvent,
  addEvent,
  deleteEventByID,
  joinEventByID,
} from "./src/controllers/events-Controller";
import express, { Application, Request, Response, NextFunction } from "express";
import { requireStaff, requireAuth } from "./src/middlewares/auth";
import cors from "cors";

const app: Application = express();

app.use(cors()); // Allow CORS for frontend
app.use(express.json()); // Parse incoming JSON requests

// Users EndPoints
//Get
app.get("/api/users", getAllUsers);
app.get("/api/users/:user_id", getSingleUser);
//Patch
app.patch("/api/users/:user_id", patchUser);
//Post
app.post("/api/auth/register", registerUser);
app.post("/api/auth/login", loginUser);

//////////////////////

// Event EndPoints
//Get
app.get("/api/events", getAllEvents);
app.get("/api/events/:event_id", getSingleEvent);
//Patch
app.patch("/api/events/:event_id", patchEvent);
//Post
app.post("/api/events/addEvent", requireStaff, addEvent);
app.post("/api/events/:event_id/join", requireAuth, joinEventByID);
//Delete
app.delete("/api/events/:event_id", deleteEventByID);

export default app;

import {
  getAllUsers,
  getSingleUser,
  patchUser,
} from "./src/controllers/users-Controller";

import express, { Application, Request, Response, NextFunction } from "express";

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

export default app;

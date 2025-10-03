import { getAllUsers } from "./src/controllers/users-Controller";

import express, { Application, Request, Response, NextFunction } from "express";

import cors from "cors";

const app: Application = express();

app.use(cors()); // Allow CORS for frontend
app.use(express.json()); // Parse incoming JSON requests

// Users EndPoints

//Get
app.get("/api/users", getAllUsers);

export default app;

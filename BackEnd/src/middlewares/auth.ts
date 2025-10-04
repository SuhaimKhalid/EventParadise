import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      user_id: number;
      role: string;
    };

    // Save user info in request for later use
    (req as any).user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

export const requireStaff = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      user_id: number;
      role: string;
    };

    if (decoded.role !== "staff") {
      return res.status(403).json({ msg: "Forbidden: Staff only" });
    }

    // Save user info in request for later use if needed
    (req as any).user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

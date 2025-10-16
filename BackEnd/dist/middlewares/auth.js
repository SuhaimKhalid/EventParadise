"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireStaff = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ msg: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        // Save user info in request for later use
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }
};
exports.requireAuth = requireAuth;
const requireStaff = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ msg: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        if (decoded.role !== "staff") {
            return res.status(403).json({ msg: "Forbidden: Staff only" });
        }
        // Save user info in request for later use if needed
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }
};
exports.requireStaff = requireStaff;

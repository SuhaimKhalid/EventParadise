"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.patchUser = exports.getSingleUser = exports.getAllUsers = void 0;
const users_model_1 = require("../models/users-model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAllUsers = async (req, res, next) => {
    try {
        const result = await (0, users_model_1.selectAllUsers)();
        res.status(200).json({ users: result });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllUsers = getAllUsers;
const getSingleUser = async (req, res, next) => {
    try {
        const user_id = Number(req.params.user_id);
        if (isNaN(user_id) || user_id <= 0) {
            res.status(400).json({ msg: "Invalid user ID" });
            return;
        }
        const result = await (0, users_model_1.selectSingleUser)(user_id);
        res.status(200).json({ user: result });
    }
    catch (err) {
        next(err);
    }
};
exports.getSingleUser = getSingleUser;
const patchUser = async (req, res, next) => {
    try {
        const user_id = Number(req.params.user_id);
        if (isNaN(user_id)) {
            res.status(400).json({ msg: "Invalid user ID" });
            return;
        }
        const updateData = req.body;
        if (updateData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)) {
            res.status(400).json({ msg: "Invalid email format" });
            return;
        }
        const result = await (0, users_model_1.updateUserByID)(user_id, updateData);
        res.status(200).json({ user: result });
    }
    catch (err) {
        // Handle PostgreSQL unique constraint violation
        if (err.code === "23505") {
            res.status(409).json({ msg: "Email already in use" });
            return;
        }
        next(err);
    }
};
exports.patchUser = patchUser;
const registerUser = async (req, res, next) => {
    try {
        const registerData = req.body;
        const { name, email, password, role } = registerData;
        if (!name || !email || !password) {
            res.status(400).json({ msg: "Name, email and password are required" });
            return;
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).json({ msg: "Invalid email format" });
            return;
        }
        // Default role is "member" if not provided
        const userRole = role || "member";
        const result = await (0, users_model_1.insertUser)({ name, email, password, role: userRole });
        res.status(201).json({ user: result });
    }
    catch (err) {
        if (err.code === "23505") {
            res.status(409).json({ msg: "Email already in use" });
            return;
        }
        next(err);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ msg: "Email and password are required" });
            return;
        }
        const user = await (0, users_model_1.getUserByEmail)(email);
        if (!user) {
            res.status(401).json({ msg: "Invalid email or password" });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ msg: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
        res.status(200).json({
            msg: "Login successful",
            token,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.loginUser = loginUser;

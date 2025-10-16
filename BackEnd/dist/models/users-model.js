"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = exports.insertUser = exports.updateUserByID = exports.selectSingleUser = exports.selectAllUsers = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const selectAllUsers = async () => {
    const result = await connection_1.default.query("SELECT * FROM users");
    return result.rows;
};
exports.selectAllUsers = selectAllUsers;
const selectSingleUser = async (user_id) => {
    const result = await connection_1.default.query("SELECT * FROM users WHERE user_id=$1", [
        user_id,
    ]);
    if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return result.rows[0];
};
exports.selectSingleUser = selectSingleUser;
const updateUserByID = async (user_id, updateData) => {
    const field = Object.keys(updateData);
    const values = Object.values(updateData);
    if (field.length <= 0) {
        throw { status: 400, msg: "No update data provided" };
    }
    const setClause = field
        .map((field, index) => `${field}= $${index + 1}`)
        .join(", ");
    const result = await connection_1.default.query(`UPDATE users SET ${setClause} WHERE user_id=$${field.length + 1} RETURNING *;`, [...values, user_id]);
    if (result.rows.length === 0) {
        throw { status: 404, msg: "User not found" };
    }
    return result.rows[0];
};
exports.updateUserByID = updateUserByID;
const insertUser = async (registerUser) => {
    const { name, email, password, role } = registerUser;
    const assignedRole = role || "member";
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const result = await connection_1.default.query(`INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING user_id, name, email, role, created_at`, [name, email, hashedPassword, assignedRole]);
    return result.rows[0];
};
exports.insertUser = insertUser;
const getUserByEmail = async (email) => {
    const result = await connection_1.default.query(`SELECT * FROM users WHERE email = $1`, [
        email,
    ]);
    return result.rows[0];
};
exports.getUserByEmail = getUserByEmail;

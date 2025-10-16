"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertEmailLog = exports.selectEmailById = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const selectEmailById = async (email_id) => {
    const result = await connection_1.default.query(`SELECT email_id, user_id, event_id, status, sent_at FROM emails_log WHERE email_id = $1`, [email_id]);
    if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Email log not found" });
    }
    return result.rows[0];
};
exports.selectEmailById = selectEmailById;
const insertEmailLog = async (emailData) => {
    const { user_id, event_id, status } = emailData;
    const result = await connection_1.default.query(`INSERT INTO emails_log (user_id, event_id, status) VALUES ($1, $2, $3) RETURNING email_id, user_id, event_id, status, sent_at`, [user_id, event_id, status || "sent"]);
    return result.rows[0];
};
exports.insertEmailLog = insertEmailLog;

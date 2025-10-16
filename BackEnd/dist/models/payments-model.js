"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertPayment = exports.selectPaymentsByUser = exports.selectPaymentById = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const selectPaymentById = async (payment_id) => {
    const result = await connection_1.default.query(`SELECT payment_id, user_id, event_id, amount, status, created_at FROM payments WHERE payment_id = $1`, [payment_id]);
    if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Payment not found" });
    }
    const payment = result.rows[0];
    payment.amount = Number(payment.amount); // Ensure amount is a number
    return payment;
};
exports.selectPaymentById = selectPaymentById;
const selectPaymentsByUser = async (user_id) => {
    const result = await connection_1.default.query(`SELECT payment_id, user_id, event_id, amount, status, created_at FROM payments WHERE user_id = $1`, [user_id]);
    return result.rows.map((payment) => ({
        ...payment,
        amount: Number(payment.amount), // Ensure amount is a number
    }));
};
exports.selectPaymentsByUser = selectPaymentsByUser;
const insertPayment = async (paymentData) => {
    const { user_id, event_id, amount, status } = paymentData;
    const result = await connection_1.default.query(`INSERT INTO payments (user_id, event_id, amount, status) VALUES ($1, $2, $3, $4) RETURNING payment_id, user_id, event_id, amount, status, created_at`, [user_id, event_id, amount, status || "pending"]);
    return result.rows[0];
};
exports.insertPayment = insertPayment;

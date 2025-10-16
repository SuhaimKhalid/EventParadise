"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPayments = exports.getPaymentStatus = exports.createPayment = void 0;
const payments_model_1 = require("../models/payments-model");
const createPayment = async (req, res, next) => {
    try {
        const { user_id, event_id, amount } = req.body;
        if (!user_id || !event_id || !amount) {
            res
                .status(400)
                .json({ msg: "user_id, event_id and amount are required" });
            return;
        }
        const payment = await (0, payments_model_1.insertPayment)({
            user_id,
            event_id,
            amount,
            status: "pending",
        });
        res.status(201).json({ payment });
    }
    catch (err) {
        next(err);
    }
};
exports.createPayment = createPayment;
const getPaymentStatus = async (req, res, next) => {
    try {
        const payment_id = Number(req.params.id);
        if (isNaN(payment_id) || payment_id <= 0) {
            res.status(400).json({ msg: "Invalid payment ID" });
            return;
        }
        const payment = await (0, payments_model_1.selectPaymentById)(payment_id);
        res.status(200).json({ payment });
    }
    catch (err) {
        next(err);
    }
};
exports.getPaymentStatus = getPaymentStatus;
const getUserPayments = async (req, res, next) => {
    try {
        const user_id = Number(req.params.id);
        if (isNaN(user_id) || user_id <= 0) {
            res.status(400).json({ msg: "Invalid user ID" });
            return;
        }
        const payments = await (0, payments_model_1.selectPaymentsByUser)(user_id);
        res.status(200).json({ payments });
    }
    catch (err) {
        next(err);
    }
};
exports.getUserPayments = getUserPayments;

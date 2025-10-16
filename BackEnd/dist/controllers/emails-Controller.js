"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailStatus = exports.sendEmail = void 0;
const emails_model_1 = require("../models/emails-model");
const sendEmail = async (req, res, next) => {
    try {
        const { user_id, event_id, status } = req.body;
        if (!user_id || !event_id) {
            res.status(400).json({ msg: "user_id and event_id are required" });
            return;
        }
        const emailLog = await (0, emails_model_1.insertEmailLog)({ user_id, event_id, status });
        res.status(201).json({ emailLog });
    }
    catch (err) {
        next(err);
    }
};
exports.sendEmail = sendEmail;
const getEmailStatus = async (req, res, next) => {
    try {
        const email_id = Number(req.params.id);
        if (isNaN(email_id) || email_id <= 0) {
            res.status(400).json({ msg: "Invalid email ID" });
            return;
        }
        const emailLog = await (0, emails_model_1.selectEmailById)(email_id);
        res.status(200).json({ emailLog });
    }
    catch (err) {
        next(err);
    }
};
exports.getEmailStatus = getEmailStatus;

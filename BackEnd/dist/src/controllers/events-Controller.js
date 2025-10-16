"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinEventByID = exports.deleteEventByID = exports.addEvent = exports.patchEvent = exports.getSingleEvent = exports.getAllEvents = void 0;
const events_model_1 = require("../models/events-model");
const getAllEvents = async (req, res, next) => {
    try {
        const result = await (0, events_model_1.selectAllEvents)();
        res.status(200).json({ events: result });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllEvents = getAllEvents;
const getSingleEvent = async (req, res, next) => {
    try {
        const event_id = Number(req.params.event_id);
        if (isNaN(event_id) || event_id <= 0) {
            res.status(400).json({ msg: "Invalid Event ID" });
            return;
        }
        const result = await (0, events_model_1.selectSingleEvent)(event_id);
        res.status(200).json({ event: result });
    }
    catch (err) {
        next(err);
    }
};
exports.getSingleEvent = getSingleEvent;
const patchEvent = async (req, res, next) => {
    try {
        const event_id = Number(req.params.event_id);
        const UpdateEventData = req.body;
        if (isNaN(event_id) || event_id <= 0) {
            res.status(400).json({ msg: "Invalid Event ID" });
            return;
        }
        const result = await (0, events_model_1.updateEvent)(event_id, UpdateEventData);
        res.status(200).json({ event: result });
    }
    catch (err) {
        next(err);
    }
};
exports.patchEvent = patchEvent;
const addEvent = async (req, res, next) => {
    try {
        const addEventData = req.body;
        const result = await (0, events_model_1.insertEvent)(addEventData);
        res.status(201).json({ event: result });
    }
    catch (err) {
        next(err);
    }
};
exports.addEvent = addEvent;
const deleteEventByID = async (req, res, next) => {
    try {
        const event_id = Number(req.params.event_id);
        if (isNaN(event_id) || event_id <= 0) {
            res.status(400).json({ msg: "Invalid Event ID" });
            return;
        }
        const result = await (0, events_model_1.deleteEvent)(event_id);
        if (!result) {
            next({ status: 404, msg: "Event Not Found" });
            return;
        }
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.deleteEventByID = deleteEventByID;
const joinEventByID = async (req, res, next) => {
    try {
        const event_id = Number(req.params.event_id);
        if (isNaN(event_id) || event_id <= 0) {
            res.status(400).json({ msg: "Invalid Event ID" });
            return;
        }
        const user = req.user;
        const user_id = user.user_id;
        const result = await (0, events_model_1.joinEvent)(event_id, user_id);
        res.status(201).json({ event_member: result });
    }
    catch (err) {
        next(err);
    }
};
exports.joinEventByID = joinEventByID;

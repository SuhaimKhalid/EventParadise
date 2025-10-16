"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectUserEvents = exports.selectEventAttendees = exports.joinEvent = exports.deleteEvent = exports.insertEvent = exports.updateEvent = exports.selectSingleEvent = exports.selectAllEvents = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const selectAllEvents = async () => {
    const result = await connection_1.default.query(`SELECT event_id, title, description, start_date, end_date, location, type,
            price::INT AS price, creator_id, image_url, created_at
     FROM events`);
    return result.rows;
};
exports.selectAllEvents = selectAllEvents;
const selectSingleEvent = async (event_id) => {
    const result = await connection_1.default.query(`SELECT event_id, title, description, start_date, end_date, location, type,
            price::INT AS price, creator_id, image_url, created_at
     FROM events WHERE event_id=$1`, [event_id]);
    return result.rows[0];
};
exports.selectSingleEvent = selectSingleEvent;
const updateEvent = async (event_id, updateEvent) => {
    const field = Object.keys(updateEvent);
    const values = Object.values(updateEvent);
    const setClause = field
        .map((field, index) => `${field}=$${index + 1}`)
        .join(", ");
    const result = await connection_1.default.query(`UPDATE events SET ${setClause} WHERE event_id=$${field.length + 1} RETURNING *;`, [...values, event_id]);
    // Convert numeric strings to numbers
    const event = result.rows[0];
    if (event && typeof event.price === "string") {
        event.price = Number(event.price);
    }
    return event;
};
exports.updateEvent = updateEvent;
const insertEvent = async (eventData) => {
    const { title, description, start_date, end_date, location, type, price, creator_id, image_url, } = eventData;
    const result = await connection_1.default.query(`INSERT INTO events (title,description,start_date,end_date,location,type,price,creator_id,image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`, [
        title,
        description,
        start_date,
        end_date,
        location,
        type,
        price,
        creator_id,
        image_url,
    ]);
    // Convert numeric strings to numbers
    const event = result.rows[0];
    if (event && typeof event.price === "string") {
        event.price = Number(event.price);
    }
    return event;
};
exports.insertEvent = insertEvent;
const deleteEvent = async (event_id) => {
    // Delete dependent records first to avoid foreign key constraints
    await connection_1.default.query(`DELETE FROM emails_log WHERE event_id = $1;`, [event_id]);
    await connection_1.default.query(`DELETE FROM event_members WHERE event_id = $1;`, [event_id]);
    await connection_1.default.query(`DELETE FROM payments WHERE event_id = $1;`, [event_id]);
    const result = await connection_1.default.query(`DELETE FROM events WHERE event_id = $1 RETURNING *;`, [event_id]);
    return result.rows[0] || null;
};
exports.deleteEvent = deleteEvent;
const joinEvent = async (event_id, user_id) => {
    // Check if event exists
    const eventResult = await connection_1.default.query(`SELECT * FROM events WHERE event_id = $1;`, [event_id]);
    const event = eventResult.rows[0];
    if (!event) {
        throw { status: 404, msg: "Event not found" };
    }
    // Check if already joined
    const memberResult = await connection_1.default.query(`SELECT * FROM event_members WHERE event_id = $1 AND user_id = $2;`, [event_id, user_id]);
    if (memberResult.rows.length > 0) {
        throw { status: 400, msg: "Already joined this event" };
    }
    // Insert into event_members
    const memberInsert = await connection_1.default.query(`INSERT INTO event_members (event_id, user_id) VALUES ($1, $2) RETURNING *;`, [event_id, user_id]);
    // If paid event, create payment
    if (event.type === "paid") {
        await connection_1.default.query(`INSERT INTO payments (user_id, event_id, amount, status) VALUES ($1, $2, $3, 'pending');`, [user_id, event_id, event.price]);
    }
    return memberInsert.rows[0];
};
exports.joinEvent = joinEvent;
const selectEventAttendees = async (event_id) => {
    const result = await connection_1.default.query(`SELECT u.user_id, u.name, u.email, u.role, em.joined_at
     FROM event_members em
     JOIN users u ON em.user_id = u.user_id
     WHERE em.event_id = $1`, [event_id]);
    return result.rows;
};
exports.selectEventAttendees = selectEventAttendees;
const selectUserEvents = async (user_id) => {
    const result = await connection_1.default.query(`SELECT e.event_id, e.title, e.description, e.start_date, e.end_date, e.location, e.type, e.price::INT AS price, e.image_url, e.created_at, em.joined_at
     FROM event_members em
     JOIN events e ON em.event_id = e.event_id
     WHERE em.user_id = $1`, [user_id]);
    return result.rows;
};
exports.selectUserEvents = selectUserEvents;

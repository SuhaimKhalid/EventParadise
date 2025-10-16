"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_Controller_1 = require("./controllers/users-Controller");
const events_Controller_1 = require("./controllers/events-Controller");
const express_1 = __importDefault(require("express"));
const auth_1 = require("./middlewares/auth");
const cors_1 = __importDefault(require("cors"));
const event_Members_Controller_1 = require("./controllers/event-Members-Controller");
const payments_Controller_1 = require("./controllers/payments-Controller");
const emails_Controller_1 = require("./controllers/emails-Controller");
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Allow CORS for frontend
app.use(express_1.default.json()); // Parse incoming JSON requests
// Users EndPoints
app.get("/api/users", users_Controller_1.getAllUsers);
app.get("/api/users/:user_id", users_Controller_1.getSingleUser);
app.patch("/api/users/:user_id", users_Controller_1.patchUser);
app.post("/api/auth/register", users_Controller_1.registerUser);
app.post("/api/auth/login", users_Controller_1.loginUser);
// Event EndPoints
app.get("/api/events", events_Controller_1.getAllEvents);
app.get("/api/events/:event_id", events_Controller_1.getSingleEvent);
app.patch("/api/events/:event_id", auth_1.requireStaff, events_Controller_1.patchEvent);
app.post("/api/events", auth_1.requireStaff, events_Controller_1.addEvent);
app.post("/api/events/:event_id/register", auth_1.requireAuth, events_Controller_1.joinEventByID);
app.delete("/api/events/:event_id", auth_1.requireStaff, events_Controller_1.deleteEventByID);
// Event Members EndPoints
app.get("/api/events/:id/attendees", auth_1.requireStaff, event_Members_Controller_1.getEventAttendees);
app.get("/api/users/:id/events", event_Members_Controller_1.getUserEvents);
// Payments EndPoints
app.post("/api/payments/create", auth_1.requireAuth, payments_Controller_1.createPayment);
app.get("/api/payments/:id", payments_Controller_1.getPaymentStatus);
app.get("/api/users/:id/payments", payments_Controller_1.getUserPayments);
// Emails EndPoints
app.post("/api/emails/send", emails_Controller_1.sendEmail);
app.get("/api/emails/:id", emails_Controller_1.getEmailStatus);
exports.default = app;

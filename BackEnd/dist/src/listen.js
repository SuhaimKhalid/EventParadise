"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("./api"));
const dotenv_1 = __importDefault(require("dotenv"));
const seeds_1 = __importDefault(require("./db/seeds/seeds"));
const development_Data_1 = __importDefault(require("./db/Development-Data/development_Data"));
dotenv_1.default.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 9090;
(async () => {
    try {
        console.log("Running database seed/migration...");
        await (0, seeds_1.default)(development_Data_1.default);
        console.log("Database ready.");
    }
    catch (err) {
        console.error("Error seeding/migrating database:", err);
    }
    api_1.default.listen(PORT, () => {
        console.log(`Listening on ${PORT}...`);
    });
})();

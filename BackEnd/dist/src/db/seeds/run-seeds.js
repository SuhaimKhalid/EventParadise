"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const development_Data_1 = __importDefault(require("../Development-Data/development_Data"));
const seeds_1 = __importDefault(require("./seeds"));
const connection_1 = __importDefault(require("../connection"));
const runSeed = async () => {
    try {
        await (0, seeds_1.default)(development_Data_1.default);
    }
    catch (err) {
        console.error("Seeding Error:", err);
    }
    finally {
        await connection_1.default.end();
    }
};
runSeed();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDb = readDb;
exports.writeDb = writeDb;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.resolve(process.cwd(), "src", "data", "db.json");
async function readDb() {
    const raw = await fs_1.promises.readFile(dbPath, "utf-8");
    return JSON.parse(raw);
}
async function writeDb(data) {
    await fs_1.promises.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

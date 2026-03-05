"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMembers = getMembers;
exports.createMember = createMember;
const crypto_1 = require("crypto");
const fileService_1 = require("../services/fileService");
const allowedCategories = ["ux", "dev frontend", "dev backend"];
async function getMembers(_req, res) {
    const db = await (0, fileService_1.readDb)();
    res.json(db.members);
}
async function createMember(req, res) {
    const { name, category } = req.body;
    if (!name || !category) {
        return res.status(400).json({ message: "name and category are required" });
    }
    if (!allowedCategories.includes(category)) {
        return res.status(400).json({ message: "invalid category" });
    }
    const db = await (0, fileService_1.readDb)();
    const newMember = {
        id: (0, crypto_1.randomUUID)(),
        name,
        category
    };
    db.members.push(newMember);
    await (0, fileService_1.writeDb)(db);
    res.status(201).json(newMember);
}

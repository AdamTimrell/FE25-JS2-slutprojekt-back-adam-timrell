"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssignments = getAssignments;
exports.createAssignment = createAssignment;
exports.assignAssignment = assignAssignment;
exports.markAssignmentDone = markAssignmentDone;
exports.deleteAssignment = deleteAssignment;
const crypto_1 = require("crypto");
const fileService_1 = require("../services/fileService");
const allowedCategories = ["ux", "dev frontend", "dev backend"];
async function getAssignments(_req, res) {
    const db = await (0, fileService_1.readDb)();
    res.json(db.assignments);
}
async function createAssignment(req, res) {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
        return res.status(400).json({ message: "title, description and category are required" });
    }
    if (!allowedCategories.includes(category)) {
        return res.status(400).json({ message: "invalid category" });
    }
    const db = await (0, fileService_1.readDb)();
    const newAssignment = {
        id: (0, crypto_1.randomUUID)(),
        title,
        description,
        category,
        status: "new",
        assignedTo: null,
        timestamp: new Date().toISOString()
    };
    db.assignments.push(newAssignment);
    await (0, fileService_1.writeDb)(db);
    res.status(201).json(newAssignment);
}
async function assignAssignment(req, res) {
    const { id } = req.params;
    const { memberId } = req.body;
    if (!memberId) {
        return res.status(400).json({ message: "memberId is required" });
    }
    const db = await (0, fileService_1.readDb)();
    const assignment = db.assignments.find((a) => a.id === id);
    if (!assignment) {
        return res.status(404).json({ message: "assignment not found" });
    }
    if (assignment.status !== "new") {
        return res.status(400).json({ message: "only new assignments can be assigned" });
    }
    const member = db.members.find((m) => m.id === memberId);
    if (!member) {
        return res.status(404).json({ message: "member not found" });
    }
    if (member.category !== assignment.category) {
        return res.status(400).json({ message: "member category must match assignment category" });
    }
    assignment.assignedTo = member.id;
    assignment.status = "doing";
    await (0, fileService_1.writeDb)(db);
    res.json(assignment);
}
async function markAssignmentDone(req, res) {
    const { id } = req.params;
    const db = await (0, fileService_1.readDb)();
    const assignment = db.assignments.find((a) => a.id === id);
    if (!assignment) {
        return res.status(404).json({ message: "assignment not found" });
    }
    if (assignment.status !== "doing") {
        return res.status(400).json({ message: "only doing assignments can be marked done" });
    }
    assignment.status = "done";
    await (0, fileService_1.writeDb)(db);
    res.json(assignment);
}
async function deleteAssignment(req, res) {
    const { id } = req.params;
    const db = await (0, fileService_1.readDb)();
    const assignment = db.assignments.find((a) => a.id === id);
    if (!assignment) {
        return res.status(404).json({ message: "assignment not found" });
    }
    if (assignment.status !== "done") {
        return res.status(400).json({ message: "only done assignments can be deleted" });
    }
    db.assignments = db.assignments.filter((a) => a.id !== id);
    await (0, fileService_1.writeDb)(db);
    res.status(204).send();
}

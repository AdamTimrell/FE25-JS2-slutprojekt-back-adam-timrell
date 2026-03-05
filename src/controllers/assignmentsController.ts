import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { readDb, writeDb } from "../services/fileService";
import { Assignment, Category } from "../../shared/types";

const allowedCategories: Category[] = ["ux", "dev frontend", "dev backend"];

export async function getAssignments(_req: Request, res: Response) {
  const db = await readDb();
  res.json(db.assignments);
}

export async function createAssignment(req: Request, res: Response) {
  const { title, description, category } = req.body as {
    title?: string;
    description?: string;
    category?: Category;
  };

  if (!title || !description || !category) {
    return res.status(400).json({ message: "title, description and category are required" });
  }

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ message: "invalid category" });
  }

  const db = await readDb();

  const newAssignment: Assignment = {
    id: randomUUID(),
    title,
    description,
    category,
    status: "new",
    assignedTo: null,
    timestamp: new Date().toISOString()
  };

  db.assignments.push(newAssignment);
  await writeDb(db);

  res.status(201).json(newAssignment);
}

export async function assignAssignment(req: Request, res: Response) {
  const { id } = req.params;
  const { memberId } = req.body as { memberId?: string };

  if (!memberId) {
    return res.status(400).json({ message: "memberId is required" });
  }

  const db = await readDb();
  const assignment = db.assignments.find((a) => a.id === id);

  if (!assignment) {
    return res.status(404).json({message: "assignment not found"});
  }

  if (assignment.status !== "new") {
    return res.status(400).json({message: "only new assignments can be assigned"});
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

  await writeDb(db);
  res.json(assignment);
  
}


export async function markAssignmentDone(req: Request, res: Response) {
  const { id } = req.params;

  const db = await readDb();
  const assignment = db.assignments.find((a) => a.id === id);

  if (!assignment) {
    return res.status(404).json({ message: "assignment not found" });
  }

  if (assignment.status !== "doing") {
    return res.status(400).json({ message: "only doing assignments can be marked done" });
  }

  assignment.status = "done";
  await writeDb(db);

  res.json(assignment);
}

export async function deleteAssignment(req: Request, res: Response) {
  const { id } = req.params;

  const db = await readDb();
  const assignment = db.assignments.find((a) => a.id === id);

  if (!assignment) {
    return res.status(404).json({ message: "assignment not found" });
  }

  if (assignment.status !== "done") {
    return res.status(400).json({ message: "only done assignments can be deleted" });
  }

  db.assignments = db.assignments.filter((a) => a.id !== id);
  await writeDb(db);

  res.status(204).send();
}
import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { readDb, writeDb } from "../services/fileService";
import { Category, Member } from "../../shared/types";

const allowedCategories: Category[] = ["ux", "dev frontend", "dev backend"];

export async function getMembers(_req: Request, res: Response) {
  const db = await readDb();
  res.json(db.members);
}

export async function createMember(req: Request, res: Response) {
  const { name, category } = req.body as { name?: string; category?: Category };

  if (!name || !category) {
    return res.status(400).json({ message: "name and category are required" });
  }

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ message: "invalid category" });
  }

  const db = await readDb();

  const newMember: Member = {
    id: randomUUID(),
    name,
    category
  };

  db.members.push(newMember);
  await writeDb(db);

  res.status(201).json(newMember);
}

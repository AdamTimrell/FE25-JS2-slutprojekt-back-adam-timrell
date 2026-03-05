import { promises as fs } from "fs";
import path from "path";
import { Database } from "../../shared/types";

const dbPath = path.resolve(process.cwd(), "src", "data", "db.json");

export async function readDb(): Promise<Database> {
  const raw = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(raw) as Database;
}

export async function writeDb(data: Database): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
}
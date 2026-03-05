import express from "express";
import cors from "cors";
import membersRouter from "./routes/members";
import assignmentsRouter from "./routes/assignments";

export const app = express();

app.use(express.json())
app.use(cors());
app.use("/members", membersRouter);
app.use("/assignments", assignmentsRouter);

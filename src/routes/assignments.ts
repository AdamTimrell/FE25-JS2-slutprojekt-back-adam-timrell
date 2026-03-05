import { Router } from "express";
import {
  assignAssignment,
  createAssignment,
  deleteAssignment,
  getAssignments,
  markAssignmentDone
} from "../controllers/assignmentsController";

const router = Router();

router.get("/", getAssignments);
router.post("/", createAssignment);
router.patch("/:id/assign", assignAssignment);
router.patch("/:id/done", markAssignmentDone);
router.delete("/:id", deleteAssignment);

export default router;
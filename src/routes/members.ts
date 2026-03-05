import { Router } from "express";
import { createMember, getMembers } from "../controllers/membersController";

const router = Router();

router.get("/", getMembers);
router.post("/", createMember);

export default router;
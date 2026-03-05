"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const membersController_1 = require("../controllers/membersController");
const router = (0, express_1.Router)();
router.get("/", membersController_1.getMembers);
router.post("/", membersController_1.createMember);
exports.default = router;

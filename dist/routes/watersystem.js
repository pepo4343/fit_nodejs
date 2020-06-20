"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const watersystem_1 = require("../controllers/watersystem");
const router = express_1.Router();
router.get("/schedule/list", watersystem_1.listSchedule);
router.post("/schedule/set", watersystem_1.setSchedule);
exports.default = router;

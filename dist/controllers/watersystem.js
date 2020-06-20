"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSchedule = exports.listScheduleCSV = exports.listSchedule = void 0;
const watersystem_1 = require("../models/watersystem");
exports.listSchedule = async (req, res, next) => {
    const result = await watersystem_1.WaterSystem.get();
    res.status(201).json(result);
};
exports.listScheduleCSV = async (req, res, next) => {
    const result = await watersystem_1.WaterSystem.get();
    console.log();
    const csvResults = Object.values(result);
    csvResults.shift();
    res.status(201).send(csvResults.join(','));
};
exports.setSchedule = async (req, res, next) => {
    console.log(req.body);
    await watersystem_1.WaterSystem.save(req.body);
    res.status(200).json({ message: 'Update Successful' });
};

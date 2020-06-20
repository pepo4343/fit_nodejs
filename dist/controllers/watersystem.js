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
    const startTimeMorning = csvResults[0].split('.').map((v, i) => {
        return parseInt(v) * (i == 0 ? 3600 : 60);
    });
    const startTimeEvening = csvResults[2].split('.').map((v, i) => {
        return parseInt(v) * (i == 0 ? 3600 : 60);
    });
    csvResults[0] = startTimeMorning.reduce((a, b) => a + b, 0);
    csvResults[2] = startTimeEvening.reduce((a, b) => a + b, 0);
    res.status(201).send(csvResults.join(','));
};
exports.setSchedule = async (req, res, next) => {
    console.log(req.body);
    await watersystem_1.WaterSystem.save(req.body);
    res.status(200).json({ message: 'Update Successful' });
};

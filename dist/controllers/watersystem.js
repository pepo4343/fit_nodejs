"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSchedule = void 0;
exports.listSchedule = (req, res, next) => {
    res.status(201).json({
        morningStartHour: 8,
        morningStartMinute: 0,
        morningTimePerStation: 15,
        eveningStartHour: 16,
        eveningStartMinut: 0,
        eveningTimePerStation: 15,
    });
};

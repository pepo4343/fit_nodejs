"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterSystem = void 0;
const db_1 = require("../utils/db");
const mongodb_1 = require("mongodb");
const defaultSchedule = {
    startTimeMorning: "8.0",
    timePerStationMorning: 15,
    startTimeEvening: "16.0",
    timePerStationEvening: 15
};
const collection = 'watersystem';
class WaterSystem {
    constructor(startTimeMorning, timePerStationMorning, startTimeEvening, timePerStationEvening) {
        this.startTimeMorning = startTimeMorning;
        this.timePerStationMorning = timePerStationMorning;
        this.startTimeEvening = startTimeEvening;
        this.timePerStationEvening = timePerStationEvening;
    }
}
exports.WaterSystem = WaterSystem;
WaterSystem.save = async (saveObject) => {
    let _id;
    const db_collection = db_1.getDb().collection(collection);
    const findScheduleResults = await db_collection.findOne({});
    if (!findScheduleResults) {
        const insertResults = await db_collection.insertOne(defaultSchedule); //insert default value
        _id = insertResults.insertedId;
    }
    else {
        console.log(findScheduleResults);
        _id = findScheduleResults._id;
    }
    const updateScheduleResults = await db_collection.updateOne({ _id: new mongodb_1.ObjectId(_id) }, {
        $set: saveObject
    });
    return;
};
WaterSystem.get = async () => {
    let _id;
    const db_collection = db_1.getDb().collection(collection);
    const findScheduleResults = await db_collection.findOne({});
    if (!findScheduleResults) {
        const insertResults = await db_collection.insertOne(defaultSchedule); //insert default value
        const findResults = await db_collection.findOne({ _id: insertResults.insertedId });
        return findResults;
    }
    else {
        return findScheduleResults;
    }
};

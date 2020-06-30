import { getDb } from '../utils/db'
import { ObjectId } from 'mongodb';

interface Schedule {
    start: number,
    end: number
}


interface StationConfig {
    station_id: ObjectId,
    station_name: string
    schedule: number[][]

}


interface SaveObject {
    workingTime?: number[],
    stations: StationConfig[]
}

const defaultSchedule: SaveObject = {
    workingTime: [25200, 64800],
    stations: [
        {
            station_id: new ObjectId,
            station_name: "test1",
            schedule: [
                [28800, 29700,],
                [57600, 58500],
            ]
        },
        {
            station_id: new ObjectId,
            station_name: "test1",
            schedule: [
                [29700, 30600],
                [58500, 59400],
            ]
        },
        {
            station_id: new ObjectId,
            station_name: "test1",
            schedule: [
                [30600, 31500],
                [59400, 60300],

            ]
        },
        {
            station_id: new ObjectId,
            station_name: "test1",
            schedule: [
                [31500, 32400],
                [60300, 61200],

            ]
        },
    ]

}

const collection = 'watersystem';

export class WaterSystem {

    constructor(
        public startTimeMorning: string,
        public timePerStationMorning: number,
        public startTimeEvening: string,
        public timePerStationEvening: number,

    ) {

    }
    static save = async (saveObject: SaveObject) => {
        let _id: string;
        const db_collection = getDb().collection(collection);
        const findScheduleResults = await db_collection.findOne({});
        if (!findScheduleResults) {
            const insertResults = await db_collection.insertOne(defaultSchedule)//insert default value
            _id = insertResults.insertedId
        }
        else {
            console.log(findScheduleResults);
            _id = findScheduleResults._id
        }

        const updateScheduleResults = await db_collection.updateOne({ _id: new ObjectId(_id) }, {
            $set: saveObject
        })
        return

    }
    static addSchedule = async (station_id:string,schedule:number[][])=>{
        const db_collection = getDb().collection(collection);
        const id = new ObjectId(station_id)
        const findScheduleResults = await db_collection.findOne({});
        const currentScheduleIndex = findScheduleResults.stations.findIndex((e:{station_id:ObjectId})=>e.station_id.toString()==station_id);
       
        findScheduleResults.stations[currentScheduleIndex].schedule = schedule;
        await db_collection.updateOne({_id: findScheduleResults._id}, {
            $set: findScheduleResults
        })
        return
        
        
        
    }

    static get = async () => {
        let _id: string;
        const db_collection = getDb().collection(collection);
        const findScheduleResults = await db_collection.findOne({});
        if (!findScheduleResults) {
            const insertResults = await db_collection.insertOne(defaultSchedule)//insert default value
            const findResults = await db_collection.findOne({ _id: insertResults.insertedId });
            return findResults;
        }
        else {
            return findScheduleResults
        }
    }


}
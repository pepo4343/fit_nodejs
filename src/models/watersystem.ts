import { getDb } from '../utils/db'
import { ObjectId } from 'mongodb';

interface Station {
    station_id: ObjectId,
    station_name: string
    schedule: number[][]

}

interface SaveObject {
    alias?: string,
    workingTime?: number[],
    stations: Station[]
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
        public device_id: string,
        public workingTime: number[][],
        public stations: Station[]
    ) {

    }
    save = async () => {
        const db = getDb().collection(collection);
        const findAlias = await db.findOne({ device_id: new ObjectId(this.device_id) })
        if (findAlias) {
            throw Error("duplicate device")
        }

        this.stations.forEach(e => {
            e.station_id = new ObjectId();
        })
        return await db.insertOne({ ...this, device_id: new ObjectId(this.device_id) });
    }
    static updateSchedule = async (station_id: string, schedule: number[][], device_id: string) => {
        const db_collection = getDb().collection(collection);
        const id = new ObjectId(station_id)
        const findScheduleResults = await db_collection.findOne({ device_id: new ObjectId(device_id) });
        const currentScheduleIndex = findScheduleResults.stations.findIndex((e: { station_id: ObjectId }) => e.station_id.toString() == station_id);

        findScheduleResults.stations[currentScheduleIndex].schedule = schedule;
        await db_collection.updateOne({ _id: findScheduleResults._id }, {
            $set: findScheduleResults
        })
        return
    }

    static fetchAll = async () => {
        const db_collection = getDb().collection(collection);

        const aggregate = [

            {
                $lookup: {
                    from: "device",
                    localField: "device_id",
                    foreignField: "_id",
                    as: "device",
                },

            },
            {
                $unwind: {
                    path: "$device",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: "$_id",
                    workingTime: "$workingTime",
                    stations: "$stations",
                    deviceId: "$device_id",
                    deviceAlias: "$device.alias",
                    deviceName: "$device.name",
                    deviceLocalIP: "$device.localIP",
                    deviceModel: "$device.model",
                    deviceMcu: "$device.mcu",
                    deviceDescription: "$device.description",

                }
            },
        ]

        return await db_collection.aggregate(aggregate).toArray();

    }

 
    static fetchByDeviceId =  async (device_id: string) => {
        const db = getDb().collection(collection);
        return await db.findOne({device_id:new ObjectId(device_id)})
    }
    static delete = async (id: string) => {
        const db = getDb().collection(collection);
        return await db.findOneAndDelete({ _id: new ObjectId(id) })
    }


}
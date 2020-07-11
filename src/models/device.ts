import { getDb } from '../utils/db'
import { ObjectId } from 'mongodb';


const collection = "device"

export class Device {
    constructor(
        public alias: string,
        public name: string,
        public localIP: string,
        public model_id: ObjectId,
        public description?: string,
    ) { }

    save = async () => {
        const db = getDb().collection(collection);
        const findAlias = await db.findOne({ alias: this.alias })
        if (findAlias) {
            throw Error("duplicate alias")
        }
        const findIp = await db.findOne({ localIP: this.localIP })
        if (findIp) {
            throw Error("duplicate IP")
        }

        return await db.insertOne(this);
    }

    static fetchAll = async () => {
        const db = getDb().collection(collection);

        const aggregate = [

            {
                $lookup: {
                    from: "model",
                    localField: "model_id",
                    foreignField: "_id",
                    as: "model",
                },

            },
            {
                $unwind: {
                    path: "$model",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: "$_id",
                    alias: "$alias",
                    name: "$name",
                    description: "$description",
                    localIP: "$localIP",
                    model_id: "$model_id",
                    model_board: "$model.board",
                    model_mcu: "$model.mcu",
                    model_image: "$model.image",

                }
            },
        ]

        return await db.aggregate(aggregate).toArray();
    }

    static fetchById  = async (id: string) => {
        const db = getDb().collection(collection);
        return await db.findOne({_id:new ObjectId(id)})
    }

    static delete = async (id: string) => {
        const db = getDb().collection(collection);
        return await db.findOneAndDelete({ _id: new ObjectId(id) })
    }

}
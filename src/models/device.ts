import { getDb } from '../utils/db'
import { ObjectId } from 'mongodb';


const collection = "device"

export class Device {
    constructor(
        public alias: string,
        public name: string,
        public localIP: string,
        public model?: string,
        public mcu?: string,
        public description?: string,
    ) { }

    save = async () => {
        const db = getDb().collection(collection);
        const findAlias = await db.findOne({ alias: this.alias })
        if (findAlias) {
            throw Error("duplicate alias")
        }
        return await db.insertOne(this);
    }

    static fetchAll = async () => {
        const db = getDb().collection(collection);
        return await db.find({}).toArray();
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
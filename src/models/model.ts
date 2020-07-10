import { getDb } from '../utils/db'
import { ObjectId } from 'mongodb';


const collection = "model"

export class Model {
    constructor(
        public board: string,
        public mcu: string,
        public image: string,

    ) { }

    save = async () => {
        const db = getDb().collection(collection);
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
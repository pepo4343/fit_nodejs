import { getDb } from '../utils/db'
import { ObjectId } from 'mongodb';


interface SaveObject  {
    startTimeMorning?:string,
    timePerStationMorning?:number,
    startTimeEvening?:string,
    timePerStationEvening?:number
}

const defaultSchedule ={
    startTimeMorning:"8,0",
    timePerStationMorning:15,
    startTimeEvening:"16,0",
    timePerStationEvening:15
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
    static save = async (saveObject:SaveObject) =>{  
        let _id:string;
        const db_collection = getDb().collection(collection);
        const findScheduleResults = await db_collection.findOne({});
        if(!findScheduleResults){
            const insertResults = await db_collection.insertOne(defaultSchedule)//insert default value
            _id = insertResults.insertedId
        }
        else{
          console.log(findScheduleResults);
          _id = findScheduleResults._id
        }
        
        const updateScheduleResults = await db_collection.updateOne({_id:new ObjectId(_id)},{
            $set:saveObject
        })
        return
        
    }

    static get  = async ()=>{
        let _id:string;
        const db_collection = getDb().collection(collection);
        const findScheduleResults = await db_collection.findOne({});
        if(!findScheduleResults){
            const insertResults = await db_collection.insertOne(defaultSchedule)//insert default value
            const findResults = await db_collection.findOne({_id:insertResults.insertedId});
            return findResults;
        }
        else{
          return findScheduleResults
        }
    }

}
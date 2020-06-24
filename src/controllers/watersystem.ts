import { RequestHandler} from 'express'
import { WaterSystem } from '../models/watersystem'
import { ObjectId } from 'mongodb';


export  const listSchedule:RequestHandler = async (req,res,next)=>{

    const result = await WaterSystem.get();
    res.status(201).json(result)
}

export  const listScheduleMin:RequestHandler = async (req,res,next)=>{

    const result = await WaterSystem.get();
    
    delete result._id
    for(let item of result.stations){
        delete item.station_id;
        delete item.station_name;
    }
    res.status(201).json(result)
    
}

export const setSchedule:RequestHandler = async (req,res,next)=>{
    console.log(req.body);
    
    await  WaterSystem.save(req.body);

    res.status(200).json({message:'Update Successful'})
}
export const addSchedule:RequestHandler = async (req,res,next)=>{
    console.log(req.body);
    
    await  WaterSystem.addSchedule(req.body.station_id,req.body.schedule)
    res.status(200).json({message:'Update Successful'})
}
import { RequestHandler} from 'express'
import { WaterSystem } from '../models/watersystem'


export  const listSchedule:RequestHandler = async (req,res,next)=>{

    const result = await WaterSystem.get();
    res.status(201).json(result)
}

export const setSchedule:RequestHandler = async (req,res,next)=>{
    console.log(req.body);
    
    await  WaterSystem.save(req.body);

    res.status(200).json({message:'Update Successful'})
}
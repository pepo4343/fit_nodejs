import { RequestHandler} from 'express'
import { WaterSystem } from '../models/watersystem'
import { ObjectId } from 'mongodb';


export  const listSchedule:RequestHandler = async (req,res,next)=>{

    const result = await WaterSystem.get();
    res.status(201).json(result)
}

export  const listScheduleCSV:RequestHandler = async (req,res,next)=>{

    const result = await WaterSystem.get();
    console.log( );
    const  csvResults= Object.values(result)
    csvResults.shift();

    const startTimeMorning:number[] = (csvResults[0] as string).split('.').map((v,i)=>{
        return parseInt(v)*(i==0?3600:60)
    })
    

    const startTimeEvening:number[] = (csvResults[2] as string).split('.').map((v,i)=>{
        return parseInt(v)*(i==0?3600:60)
    })

    csvResults[0] = startTimeMorning.reduce((a, b) => a + b, 0)
    csvResults[2] = startTimeEvening.reduce((a, b) => a + b, 0)

    res.status(201).send(csvResults.join(','))
}

export const setSchedule:RequestHandler = async (req,res,next)=>{
    console.log(req.body);
    
    await  WaterSystem.save(req.body);

    res.status(200).json({message:'Update Successful'})
}
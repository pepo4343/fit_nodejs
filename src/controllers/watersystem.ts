import { RequestHandler} from 'express'
import { WaterSystem } from '../models/watersystem'
import { ObjectId } from 'mongodb';
import { getMqttClient } from '../utils/mqtt';
import config from '../config';


export  const listSchedule:RequestHandler = async (req,res,next)=>{

    const result = await WaterSystem.get();
    res.status(201).json(result)
}
let i = 0;
export  const listScheduleMin:RequestHandler = async (req,res,next)=>{

    const result = await WaterSystem.get();
    
    delete result._id
    for(let item of result.stations){
        delete item.station_id;
        delete item.station_name;
    }
    result.i = i
    res.status(201).json(result)
 
    
}

export const setSchedule:RequestHandler = async (req,res,next)=>{
    console.log(req.body);
    i++
    const client = getMqttClient();
    await  WaterSystem.save(req.body);
    await mqttWaterSystem();

    res.status(200).json({message:'Update Successful'})
}
export const addSchedule:RequestHandler = async (req,res,next)=>{
    console.log(req.body);
    i++
    
    await  WaterSystem.addSchedule(req.body.station_id,req.body.schedule)
    await mqttWaterSystem();
    res.status(200).json({message:'Update Successful'})
}

export const mqttWaterSystem = async () => {
    const workingTimeTopic = "watersystem/workingtime"
    const scheduleTopic = "watersystem/schedule"

    const result = await WaterSystem.get();

    const client = getMqttClient();
    client.publish(config.mqtt.defaultUri + workingTimeTopic, result.workingTime.join(","), { retain: true })
    console.log("test");
    for(let i in result.stations){
        client.publish(config.mqtt.defaultUri + scheduleTopic+`/${i}`, result.stations[i].schedule.join(","), { retain: true })
    }
}
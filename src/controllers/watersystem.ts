import { RequestHandler } from 'express'
import { WaterSystem } from '../models/watersystem'
import { ObjectId } from 'mongodb';
import { getMqttClient } from '../utils/mqtt';
import config from '../config';


export const listSchedule: RequestHandler = async (req, res, next) => {
 


    const result = await WaterSystem.get(req.params.alias);
    res.status(201).json(result)
}
export const listAllSchedule: RequestHandler = async (req, res, next) => {



    const result = await WaterSystem.findAll();
    res.status(201).json(result)
}
let i = 0;
export const listScheduleMin: RequestHandler = async (req, res, next) => {

    const result = await WaterSystem.get(req.params.alias);

    delete result._id
    for (let item of result.stations) {
        delete item.station_id;
        delete item.station_name;
    }
    result.i = i
    res.status(201).json(result)


}

export const setSchedule: RequestHandler = async (req, res, next) => {
    console.log(req.body);
    i++
    const client = getMqttClient();
    await WaterSystem.save(req.body, req.params.alias);
    await mqttWaterSystem(req.params.alias);

    res.status(200).json({ message: 'Update Successful' })
}
export const saveSchedule: RequestHandler = async (req, res, next) => {
    console.log(req.body);
    i++

    await WaterSystem.addSchedule(req.body.station_id, req.body.schedule, req.params.alias)
    await mqttWaterSystem(req.params.alias);
    res.status(200).json({ message: 'Update Successful' })
}

export const mqttWaterSystem = async (alias: string) => {
    const client = getMqttClient();
    const result = await WaterSystem.get(alias);
    client.publish(config.mqtt.defaultUri + config.mqtt.watersystem.workingtime+alias, result.workingTime.join(","), { retain: true })

   
    
    for (let i in result.stations) {
        console.log(config.mqtt.defaultUri + config.mqtt.watersystem.schedule+alias + `/${i}`);
        console.log(result.stations[i].schedule.join(","));
        client.publish(config.mqtt.defaultUri + config.mqtt.watersystem.schedule+alias + `/${i}`, result.stations[i].schedule.join(","), { retain: true })
    }
}
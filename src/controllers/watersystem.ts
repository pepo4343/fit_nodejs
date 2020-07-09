import { RequestHandler } from 'express'
import { WaterSystem } from '../models/watersystem'
import { ObjectId } from 'mongodb';
import { getMqttClient } from '../utils/mqtt';
import config from '../config';
import { mongoConnect } from '../utils/db';
import { SUCCESS_MESSAGE_EN, SUCCESS_MESSAGE_TH } from '../constants/strings';
import { Device } from '../models/device';



export const addWaterSystem: RequestHandler = async (req, res, next) => {
    try {
        const {
            device_id,
            workingTime,
            stations
        } = req.body

        const watersystem = new WaterSystem(device_id, workingTime, stations)
        await watersystem.save();

        const device = await Device.fetchById(device_id);
        publishWaterSystem(device.alias,device_id);
        
        res.status(201).json({ message_en: SUCCESS_MESSAGE_EN, message_th: SUCCESS_MESSAGE_TH })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

export const getWaterSystem: RequestHandler = async (req, res, next) => {
    try {
        const watersystems = await WaterSystem.fetchAll();
        res.status(200).json(watersystems)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

export const updateSchedule: RequestHandler = async (req, res, next) => {
    try {
        const {
            device_id,
            schedule,
            station_id
        } = req.body
        await WaterSystem.updateSchedule(station_id, schedule, device_id);

        const device = await Device.fetchById(device_id);


        publishWaterSystem(device.alias,device_id);
      


        res.status(200).json({ message_en: SUCCESS_MESSAGE_EN, message_th: SUCCESS_MESSAGE_TH })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


export const deleteWaterSystem: RequestHandler = async (req, res, next) => {
    try {
        const {
            id,
        } = req.body
        await WaterSystem.delete(id);
        res.status(200).json({ message_en: SUCCESS_MESSAGE_EN, message_th: SUCCESS_MESSAGE_TH })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}






 const publishWaterSystem = async (alias: string,device_id:string) => {
    const client = getMqttClient();
    const result = await WaterSystem.fetchByDeviceId(device_id);
    client.publish(config.mqtt.defaultUri+ alias+ "/" + config.mqtt.watersystem.workingtimeTopic , result.workingTime.join(","), { retain: true })


    for (let i in result.stations) {
        console.log();
        
        
        client.publish(config.mqtt.defaultUri + alias + "/"+ config.mqtt.watersystem.scheduleTopic + `/${i}`, result.stations[i].schedule.join(","), { retain: true })
    }
}
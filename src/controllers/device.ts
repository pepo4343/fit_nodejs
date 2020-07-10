import { RequestHandler } from 'express'
import { Device } from '../models/device'

import  {getMqttClient} from '../utils/mqtt'
import { SUCCESS_MESSAGE_EN, SUCCESS_MESSAGE_TH } from '../constants/strings'
import config from '../config'
import { ObjectId } from 'mongodb'
export const addDevice: RequestHandler = async (req, res, next) => {
    try {
        const {
            alias,
            name,
            description,
            model_id,
            localIP,
        } = req.body
        const device = new Device(alias, name,localIP,new ObjectId(model_id),description)

        await device.save();

        const client = getMqttClient();

        client.subscribe(config.mqtt.defaultUri+alias+"/"+config.mqtt.watersystem.statusTopic);
        
        res.status(201).json({message_en:SUCCESS_MESSAGE_EN,message_th:SUCCESS_MESSAGE_TH})
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

export const getDevice: RequestHandler = async (req, res, next) => {
    try {
       

        const devices = await Device.fetchAll();
        res.status(201).json(devices)

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

export const deleteDevice:RequestHandler = async (req, res, next) => {
    try {
        const {
            id,
        } = req.body
        await Device.delete(id);
        res.status(200).json({message_en:SUCCESS_MESSAGE_EN,message_th:SUCCESS_MESSAGE_TH})

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

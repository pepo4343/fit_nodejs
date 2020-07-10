import { RequestHandler } from 'express'

import { getMqttClient } from '../utils/mqtt'
import { SUCCESS_MESSAGE_EN, SUCCESS_MESSAGE_TH } from '../constants/strings'
import config from '../config'
import { ObjectId } from 'mongodb'
import { Model } from '../models/model'
export const addModel: RequestHandler = async (req, res, next) => {
    try {
        const image = req.file;
        if (!image) {
            throw new Error("No Image Set");
        }
        const {
            board,
            mcu,
        } = req.body
        console.log(image);
        const imageUriArray = image.path.split("/");
        imageUriArray.shift();
        imageUriArray.shift();
        imageUriArray.shift();
   
        
        const model = new Model(board, mcu, imageUriArray.join("/"));
        model.save();
        res.status(201).json({ message_en: SUCCESS_MESSAGE_EN, message_th: SUCCESS_MESSAGE_TH })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

export const getModel: RequestHandler = async (req, res, next) => {
    try {


        const models = await Model.fetchAll();
        res.status(201).json(models)

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

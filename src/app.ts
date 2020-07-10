import express, { NextFunction, Response, Request } from 'express';

import watersystemRoutes from './routes/watersystem'
import deviceRoutes from './routes/device'
import modelRoutes from './routes/model'

import bodyParser from 'body-parser';

import { mongoConnect } from './utils/db'

import { mqttInit, getMqttClient } from './utils/mqtt'


import { WaterSystem } from './models/watersystem';

import multer, { MulterError } from 'multer';

import Config from './config'

import path from 'path'

const app = express();


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});


const fileModelStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,"images","boards"))
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString()+"-"+file.originalname)
    }
})

const fileFilter = (req:Request,file:Express.Multer.File,cb:multer.FileFilterCallback)=>{
    if(file.mimetype==='image/png'||file.mimetype==='image/jpg'||file.mimetype==='image/jpeg'){
        cb(null,true);
    }else{
        cb(null,false); 
    }
}

// Setup body-parser
app.use(bodyParser.json());                         // application/json
app.use(bodyParser.urlencoded({ extended: false })); //application/x-www-form-urlencoded
app.use(multer({storage:fileModelStorage,fileFilter:fileFilter }).single("image"));
app.use("/images",express.static(path.join(__dirname,"images")))



app.use("/watersystem", watersystemRoutes)

app.use("/device", deviceRoutes)

app.use("/model",modelRoutes)


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ message: err.message });
})



mongoConnect(() => {
    app.listen(3000, () => {
        console.log("running on port 300");
        mqttInit();
        const client = getMqttClient();
        client.on('connect', async () => {
            publishAll()
            subscribeAll()
            setInterval(() => {
                console.log("publishing");
                publishAll()
            }, 3600000) // 1hr
        })

        client.on('message', async (topic, message) => {
           
            
        })

    });
})


const publishAll = async () => {
    const client = getMqttClient();
    const watersystems = await WaterSystem.fetchAll();
    for (let i of watersystems) {
        for (let station in i.stations) {
            client.publish(Config.mqtt.defaultUri + i.deviceAlias + "/" + Config.mqtt.watersystem.scheduleTopic + "/" + station, i.stations[station].schedule.join(","), { retain: true })
        }
        client.publish(Config.mqtt.defaultUri + i.deviceAlias + "/" + Config.mqtt.watersystem.workingtimeTopic, i.workingTime.join(","), { retain: true })

    }

}

const subscribeAll = async ()=>{
    const client = getMqttClient();
    const watersystems = await WaterSystem.fetchAll();
    for (let i of watersystems) {
        
        client.subscribe(Config.mqtt.defaultUri + i.deviceAlias + "/" + Config.mqtt.watersystem.statusTopic)

        console.log(Config.mqtt.defaultUri + i.deviceAlias + "/" + Config.mqtt.watersystem.statusTopic);
        
    }
}



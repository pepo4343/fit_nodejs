import express, { NextFunction, Response, Request } from 'express';

import watersystemRoutes from './routes/watersystem'
import deviceRoutes from './routes/device'

import bodyParser from 'body-parser';

import { mongoConnect } from './utils/db'

import { mqttInit, getMqttClient } from './utils/mqtt'


import { WaterSystem } from './models/watersystem';

import Config from './config'

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


// Setup body-parser
app.use(bodyParser.json());                         // application/json
app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded



app.use("/watersystem", watersystemRoutes)

app.use("/device", deviceRoutes)


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



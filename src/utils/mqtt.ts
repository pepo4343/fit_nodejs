import mqtt, { MqttClient } from 'mqtt'

import config from '../config'


let _client:MqttClient|undefined;
export const mqttInit = () => {
    _client = mqtt.connect(`mqtt://${config.mqtt.ip}`, { clientId: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10).toUpperCase(), })
}





export const getMqttClient = ()=>{
    if (_client) {
        return _client;
    }

    throw "Can't connect to mqtt";
}
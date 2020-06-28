import mqtt, { MqttClient } from 'mqtt'

import config from '../config'


let _client:MqttClient|undefined;
export const mqttInit = () => {
    _client = mqtt.connect(`mqtt://${config.mqtt.ip}`, { clientId: "fit_node_js", })
}

export const getMqttClient = ()=>{
    if (_client) {
        return _client;
    }

    throw "Can't connect to mqtt";
}
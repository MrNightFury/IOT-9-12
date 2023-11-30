import * as mqtt from "mqtt";
import { MositTopic } from "./ReSend.js";

export interface Pub {
    client: mqtt.MqttClient,
    topic: MositTopic
}

export class Publisher {
    host: string;
    connections: Map<string, Pub> = new Map();

    constructor(host: string) {
        this.host = host;
    }

    async setup(topics: MositTopic[]) {
        for (let topic of topics) {
            let client = await mqtt.connectAsync({
                host: this.host,
                port: 1883,
                username: topic.user,
                protocol: "mqtt"
            }).catch(err => {
                console.log("!!!" + err + "!!!");
            }).then(res => {
                return res;
            })

            if (client != null) {
                this.connections.set(topic.name, {
                    topic: topic,
                    client: client
                });
            }
        }
    }

    publish(name: string, message: string) {
        let con = this.connections.get(name);
        let messageToSend;
        if (con?.topic.messageConstructor) {
            messageToSend = con.topic.messageConstructor(name, message);
            if (messageToSend == "") {
                return;
            }
        } else {
            messageToSend = `{${con?.topic.key}: ${message}}`;
        }
        
        // console.log(`Publishing to ${con?.topic.name}(${con?.topic.user}): ${messageToSend}`);
        con?.client.publish("v1/devices/me/telemetry", messageToSend);
    }
}
import * as mqtt from "mqtt";

export class MositTopic {
    user: string;
    key: string;
    name: string;

    constructor(name: string, user: string, key: string) {
        this.key = key;
        this.user = user;
        this.name = name;
    }
}

export interface Pub {
    client: mqtt.MqttClient,
    topic: MositTopic
}

export class Publisher {
    host: string;
    // connections: Map<string, mqtt.MqttClient> = new Map();
    connections: Map<string, Pub> = new Map();

    constructor(host: string) {
        this.host = host;
    }

    async setup(topics: MositTopic[]) {
        for (let topic of topics) {
            let client = await mqtt.connectAsync({
                host: this.host,
                port: 8080,
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
        let con = this.connections.get("name");
        let messageToSend = `{${con?.topic.key}: ${message}}`;
        console.log(`Publishing to ${con?.topic.name}(${con?.topic.user}): ${messageToSend}`);
        con?.client.publish("v1/devices/me/telemetry", messageToSend);
    }
}
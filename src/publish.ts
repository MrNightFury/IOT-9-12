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

export class Publisher {
    host: string;
    connections: Map<string, mqtt.MqttClient> = new Map();
    keys: Map<string, string> = new Map();

    constructor(host: string) {
        this.host = host;
    }

    setup(topics: MositTopic[]) {
        for (let topic of topics) {
            this.connections.set(topic.name, mqtt.connect({
                hostname: this.host,
                username: topic.user
            }));
            this.keys.set(topic.name, topic.key);
        }
    }

    publish(name: string, message: string) {
        this.connections.get(name)?.publish("v1/devices/me/telemetry", `${this.keys.get(name)}:${message}`);
    }
}
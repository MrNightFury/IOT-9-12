import * as mqtt from "mqtt";

export class RPCSource {
    user: string
    constructor(user: string) {
        this.user = user;
    }
}

export interface RPCTopic {
    source: RPCSource;
}

export class RPCHandler {
    host: string;


    constructor(host: string) {
        this.host = host;
    }

    async setup(topics: RPCTopic[]) {
        for (let topic of topics) {
            let client = await mqtt.connectAsync({
                host: this.host,
                protocol: "mqtt",
                username: topic.source.user
            }).catch(err => {
                console.log(`!!${err}!!`);
            }).then(res => {
                return res;
            });
            if (!client) {
                return;
            }

            client.subscribe("v1/devices/me/rpc/request/+", err => {
                if (!err) {
                    console.log("Subscribed to " + topic.source.user);
                } else {
                    console.log(err);
                }
            });
            client.on("message", (topic, message) => {
                console.log(`Message on ${topic.replace("v1/devices/me/rpc/request/", "")}: ${message}`);
            })
        }
    }
}
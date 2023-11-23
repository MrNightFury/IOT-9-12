import * as mqtt from "mqtt";

export class RPCSource {
    user: string
    constructor(user: string) {
        this.user = user;
    }
}

export interface RPCTopic {
    source: RPCSource;
    handler: (topic: string, message: RPCMessage) => void
}

export interface RPCMessage {
    method: string;
    params: any;
}

export class RPCHandler {
    host: string;
    chemodan: string;

    constructor(host: string, config: any) {
        this.host = host;
        this.chemodan = config.host;
    }

    async setup(topics: RPCTopic[]) {
        for (let t of topics) {
            let client = await mqtt.connectAsync({
                host: this.host,
                protocol: "mqtt",
                username: t.source.user
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
                    console.log("Subscribed to " + t.source.user);
                } else {
                    console.log(err);
                }
            });
            client.on("message", (topic, message) => {
                let requestId = topic.replace("v1/devices/me/rpc/request/", "");
                console.log(`Message on ${requestId}: ${message}`);
                let messageInJSON = JSON.parse(message.toString()) as RPCMessage;
                t.handler(requestId, messageInJSON);
                if (client) {
                    client.publish("v1/devices/me/rpc/response/" + requestId, "1");
                }
            })
        }
    }
}
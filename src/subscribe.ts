import * as mqtt from "mqtt";
import fs from "fs";

import { Topic } from "./Topic";
import { Config } from "./Config";

export function subscribe(cfg: any, topics: Topic[], callback: any) {
    let client = mqtt.connect(cfg.host, { protocol: "mqtt"});

    client.on('connect', () => {
        for (let topic of topics) {
            client.subscribe(topic.getPath(), err => {
                if (!err) {
                    console.log("Subscribed to " + topic.getPath());
                } else {
                    console.log(err);
                }
            })
        }
    });

    client.on('message', (topic, message) => {
        callback(topic, message);
    });
}

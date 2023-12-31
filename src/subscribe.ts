import * as mqtt from "mqtt";
import { Topic } from "./ReSend.js";

export async function subscribe(cfg: any, topics: Topic[], callback: any) {    
    let client = await mqtt.connectAsync({
        host: cfg.host,
        protocol: "mqtt"
    }).catch(err => {
        console.log(`!!${err}!!`);
    }).then(res => {
        return res;
    });
    if (!client) {
        return;
    }

    console.log("Connected to chemodan");
    if(!client) {
        return;
    }
    for (let topic of topics) {
        client.subscribe(topic.getPath(), err => {
            if (!err) {
                console.log("Subscribed to " + topic.getPath());
            } else {
                console.log(err);
            }
        })
    }

    client.on('message', (topic, message) => {
        callback(topic, message);
    });
}

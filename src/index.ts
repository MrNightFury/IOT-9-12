import { subscribe } from "./subscribe.js";
import { Publisher } from "./publish.js";
import { MositTopic, Topic, Resend } from "./ReSend.js";

function getPubTopic(subTopic: string) : MositTopic | any {
    for (let i in resend) {
        if (resend[i].from.getPath() == subTopic) {
            return resend[i].to;
        }
    }
    return {}
}

let resend: Resend[] = [
    {
        from: new Topic("wb-msw-v3_21", "Sound Level"),
        to: new MositTopic("sound", "nhmy5k7zusy872wa3rq1", "sound_level")
    }, {
        from: new Topic("wb-ms_11", "Illuminance"),
        to: new MositTopic("light", "", "illuminance")
    }, {
        from: new Topic("wb-adc", "Vin"),
        to: new MositTopic("voltage", "", "Vin")
    }
]

let config = { // Вписать чемодан
    host: "192.168.1.12",
}

console.log("Connecting...");
let publisher: Publisher = new Publisher("thingsboard.mosit");
await publisher.setup(resend.map(item => item.to));

console.log("Subscribing...");
subscribe(config, resend.map(item => item.from), (topic: string, message: string) => {
    console.log(`Recieved ${topic}: ${message}`);
    publisher.publish(getPubTopic(topic).name, message);
})
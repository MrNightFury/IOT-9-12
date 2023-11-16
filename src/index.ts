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
    // {
    //     from: new Topic("wb-msw-v3_21", "Sound Level"),
    //     to: new MositTopic("sound", "rrs42oixlsbylekbqu77", "sound_level")
    // }, {
    //     from: new Topic("wb-ms_11", "Illuminance"),
    //     to: new MositTopic("light", "6syfkxwmlba0kj7yrejx", "illuminance")
    // }, {
    //     from: new Topic("wb-adc", "Vin"),
    //     to: new MositTopic("voltage", "ankuxhzc160kv0xbzkm0", "Vin")
    // },


    {
        from: new Topic("wb-msw-v3_21", "CO2"),
        to: new MositTopic("CO2", "jpndq5ev40j6o22p4lx3", "CO2")
    }, {
        from: new Topic("wb-mr3_56", "K1"),
        to: new MositTopic("K1", "awndnsr5tkrg9jqlw8e6", "K1", (name, message) => {
            if (message == "0") {
                return "";
            }
            return `name: ${name}`;
        })
    }
]

let config = { // Вписать чемодан
    host: "192.168.1.13",
}

console.log("Connecting...");
let publisher: Publisher = new Publisher("thingsboard.mosit");
await publisher.setup(resend.map(item => item.to));

console.log("Subscribing...");
subscribe(config, resend.map(item => item.from), (topic: string, message: string) => {
    console.log(`Recieved ${topic}: ${message}`);
    publisher.publish(getPubTopic(topic).name, message);
})
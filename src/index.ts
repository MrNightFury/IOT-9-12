import { Topic } from "./Topic.js";
import { subscribe } from "./subscribe.js";
import { MositTopic, Publisher } from "./publish.js";
import { Config } from "./Config.js";

// function getPubTopicName(subTopic: string) {
//     for (let i in subTopics) {
//         if (subTopics[i].getPath() == subTopic) {
//             return pubTopics[i].name;
//         }
//     }
//     return "";
// }

function getPubTopic(subTopic: string) : MositTopic | any {
    for (let i in subTopics) {
        if (subTopics[i].getPath() == subTopic) {
            return pubTopics[i];
        }
    }
    return {}
}

let subTopics: Topic[] = [
    new Topic("wb-msw-v3_21", "Sound Level"),
    new Topic("wb-ms_11", "Illuminance"),
    new Topic("wb-adc", "Vin")
]

let pubTopics: MositTopic[] = [
    new MositTopic("sound", "nhmy5k7zusy872wa3rq1", "sound_level"),
    new MositTopic("light", "", "illuminance"),
    new MositTopic("voltage", "", "Vin")
]

let config = { // Вписать чемодан
    host: "mqtt://192.168.1.12",
}

console.log("Connecting...");
let publisher: Publisher = new Publisher("thingsboard.mosit");
await publisher.setup(pubTopics);

console.log("Subscribing...");
subscribe(config, subTopics, (topic: string, message: string) => {
    console.log(`Recieved ${topic}: ${message}`);
    publisher.publish(getPubTopic(topic).name, message);
})
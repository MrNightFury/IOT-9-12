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
    new MositTopic("sound", "361t6260tz7cz53tuuty", "level"),
    new MositTopic("light", "e50mm12cdx3khsqlgw2k", "level"),
    new MositTopic("voltage", "9g5cl4vly4xnug7ca71g", "level")
]

let config = { // Вписать чемодан
    host: "mqtt://192.168.1.12",
}

let publisher: Publisher = new Publisher("mqtt://thingsboard.mosit");
publisher.setup(pubTopics);

subscribe(config, subTopics, (topic: string, message: string) => {
    console.log(`Recieved ${topic}: ${message}`);
    console.log(`Publishing ${getPubTopic(topic).name}(${getPubTopic(topic).user}): ${message}`);
    publisher.publish(getPubTopic(topic).name, message);
})
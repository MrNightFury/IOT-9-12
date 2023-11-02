import { Topic } from "./Topic.js";
import { subscribe } from "./subscribe.js";
import { MositTopic, Publisher } from "./publish.js";
import { Config } from "./Config.js";

function getPubTopic(subTopic: string) {
    for (let i in subTopics) {
        if (subTopics[i].getPath() == subTopic) {
            return pubTopics[i].name;
        }
    }
    return "";
}

let subTopics: Topic[] = [
    new Topic("wb-msw-v3_21", "Sound Level"),
    new Topic("wb-ms_11", "Illuminance"),
    new Topic("wb-adc", "Vin")
]

let pubTopics: MositTopic[] = [
    new MositTopic("sound", "i6mqx3aosr8ymnuuop0y", "level"),
    new MositTopic("light", "7giwj93c9wyn78faulup", "level"),
    new MositTopic("voltage", "hr8sfqirza2sb1i4l9qd", "level")
]

let config = { // Вписать чемодан
    host: "192.168.1.13",
}

let publisher: Publisher = new Publisher("thingsboard.mosit");
publisher.setup(pubTopics);
subscribe(config, subTopics, (topic: string, message: string) => {
    publisher.publish(getPubTopic(topic), message);
})
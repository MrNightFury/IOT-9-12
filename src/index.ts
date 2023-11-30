import { subscribe } from "./subscribe.js";
import { Publisher } from "./publish.js";
import { MositTopic, Topic, Resend } from "./ReSend.js";
import { RPCHandler, RPCSource, RPCTopic } from "./rpc.js";
import * as mqtt from "mqtt";

function getPubTopic(subTopic: string) : MositTopic | any {
    for (let i in resend) {
        if (resend[i].from.getPath() == subTopic) {
            return resend[i].to;
        }
    }
    return {}
}

function ifOne(message: string, text: string) {
    if (message == "0") {
        return "{buttonName: '0'}";
    } else {
        return text;
    }
}

function format(name: string, state: string) {
    return `{buttonName: "${name}", isOn: "${state}"}`
}

let resend: Resend[] = [
    {
        from: new Topic("wb-msw-v3_21", "Sound Level"),
        to: new MositTopic("sound", "rrs42oixlsbylekbqu77", "sound_level")
    }, {
        from: new Topic("wb-ms_11", "Illuminance"),
        to: new MositTopic("light", "6syfkxwmlba0kj7yrejx", "illuminance")
    }, {
        from: new Topic("wb-adc", "Vin"),
        to: new MositTopic("voltage", "ankuxhzc160kv0xbzkm0", "Vin")
    },


    {
        from: new Topic("wb-msw-v3_21", "CO2"),
        to: new MositTopic("CO2", "jpndq5ev40j6o22p4lx3", "CO2")
    }, {
        from: new Topic("wb-gpio", "MOD1_IN1"),
        to: new MositTopic("K1", "awndnsr5tkrg9jqlw8e6", "K1", (name, message) => {
            // return ifOne(message, "{buttonName: \"OnOff\"}");
            return format("OnOff", message)
            // return ifOne(message, "{buttonName: \"Shit\"}");
        })
    }, {
        from: new Topic("wb-gpio", "MOD1_IN2"),
        to: new MositTopic("K2", "awndnsr5tkrg9jqlw8e6", "K2", (name, message) => {
            return format("FreqUp", message)
            // return ifOne(message, "{buttonName: \"FreqUp\"}");
        })
    }, {
        from: new Topic("wb-gpio", "MOD1_IN3"),
        to: new MositTopic("K3", "awndnsr5tkrg9jqlw8e6", "K3", (name, message) => {
            return format("FreqDown", message)
            // return ifOne(message, "{buttonName: \"FreqDown\"}");
        })
    }
]

let config = {
    host: "192.168.1.13",
}

console.log("Connecting...");
let publisher: Publisher = new Publisher("thingsboard.mosit");
await publisher.setup(resend.map(item => item.to));

console.log("Subscribing...");
subscribe(config, resend.map(item => item.from), (topic: string, message: string) => {
    console.log(`[MQTT Handler] Recieved ${topic}: ${message}`);
    publisher.publish(getPubTopic(topic).name, message);
})

let rpc: RPCTopic[] = [
    {
        source: new RPCSource("jpndq5ev40j6o22p4lx3"), // Виртуальный CO2 & вентилятор
        handler: (connection, rpc, topic, message) => {
            if (message.method == "setVentState") {
                let mes = +message.params.state + "";
                let top = new Topic("wb-mr3_56", "K2").getPath() + "/on";
                console.log("[MQTT Sub] " + top + " : " + mes);
                connection.publish(top, mes)
                rpc(JSON.stringify({state: !!mes}));
            }
            console.log("[RPC Handler]" + topic + " : " + JSON.stringify(message))
        }
    }, {
        source: new RPCSource("awndnsr5tkrg9jqlw8e6"),
        handler: (connection, rpc, topic, message) => {
            if (message.method == "turnBuzzerOnOff") {
                let mes = message.params.isBuzzerOn;
                let top = new Topic("buzzer", "enabled").getPath() + "/on";
                connection.publish(top, mes);
                rpc(JSON.stringify({"actual_isBuzzerOn": mes}))
            }
            if (message.method == "setFrequency") {
                let mes = "" + message.params.frequency;
                let top = new Topic("buzzer", "frequency").getPath();
                connection.publish(top, mes);
                rpc(JSON.stringify({"actual_frequency": message.params.frequency}))
            }
            console.log("[RPC Handler]" + topic + " : " + JSON.stringify(message))
            rpc("1")
        }
    }
]
let handler = new RPCHandler("thingsboard.mosit", config);
handler.setup(rpc);
export interface Resend {
    from: Topic,
    to: MositTopic
}

export class Topic {
    device: string;
    property: string;
    constructor (dev: string, prop: string) {
        this.device = dev;
        this.property = prop;
    }
    getPath() {
        return "/devices/" + this.device + "/controls/" + this.property;
    }
}

export class MositTopic {
    user: string;
    key: string;
    name: string;

    constructor(name: string, user: string, key: string) {
        this.key = key;
        this.user = user;
        this.name = name;
    }
}
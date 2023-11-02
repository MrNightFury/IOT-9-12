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
export default class Player {
    private _id;
    private _address;
    private _port;
    constructor(id: string, address: string, port: number);
    readonly id: string;
    readonly address: string;
    readonly port: number;
}

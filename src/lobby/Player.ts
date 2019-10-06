export default class Player {
    private _id: string
    private _address: string
    private _port: number

    constructor(id: string, address: string, port: number) {
        this._id = id
        this._address = address
        this._port = port
    }

    public get id(): string {
        return this._id
    }
    public get address() : string {
        return this._address
    }    
    public get port() : number {
        return this._port
    }
    
    
}
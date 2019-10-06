import { Socket, createSocket } from "dgram"
import Player from "@Lobby/Player"

export default class Lobby {
    private server: Socket
    constructor(port: number, players: Player[]) {
        this.server = createSocket("udp4")
        this.server.bind(port)
    }

    public start() {
        this.server.on("error", (err) => {
            console.log(`[Lobby] Error:\n${err.stack}`)
            this.server.close()
        })
    }

}

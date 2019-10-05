import dgram, { Socket } from 'dgram'

class Lobby {
    private server: dgram.Socket
    constructor(port: number) {
        this.server = dgram.createSocket("udp4")
        this.server.bind(port)
    }

    public start() {
        this.server.on("error", (err) => {
            console.log(`[Lobby] Error:\n${err.stack}`)
            this.server.close()
        })
    }

}

export = Lobby
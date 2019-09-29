const NetCode = require("../utils/NetCode.js")
const { OpCode, Command } = require("../utils/Commands.js")
const accurateInterval = require("accurate-interval")

class Game {
    /**
     * Create a game instance.
     * @param {Socket} serverSocket
     * @param {Process} process
     * @param {Float} deltaTime Has to match the FixedUpdate on client side
     * @param {Player} playerClass The subclass of class Player you want to use
     */
    constructor(serverSocket, process, deltaTime, playerClass) {
        this.playerClass = playerClass
        this.players = []
        this.blocks = []
        this.server = serverSocket
        this.process = process

        this.deltaTime = deltaTime // Matches FixedUpdate on client side
    }

    start() {
        accurateInterval(() => {
            this.PhysicsTick()
        }, this.deltaTime * 1000, { aligned: true, immediate: true })

        // Check for timeouts
        let interval = 10 * 1000
        setInterval(() => {
            let time = Date.now()
            for(let i = 0; i < this.players.length; i++) {
                if(time - this.players[i].lastseen >= interval) {
                    let dcCmd = new Command(OpCode.Disconnect, this.players[i].uid)
                    this.Broadcast(dcCmd)
                    this.players.splice(i, 1)
                }
            }
        }, interval)
    }

    getPlayer(uid) {
        for(let i = 0; i < this.players.length; i++) {
            if(this.players[i].uid == uid) {
                return this.players[i]
            }
        }
        throw `[Game]: [GetPlayer]: Player '${uid}' not found`
    }

    /**
     * Send command to all connected players
     * @param {Command} command
     * @param {uid} except
     */
    broadcast(command, except) {
        for(let player of this.players) {
            if(player.uid != except)
                NetCode.Send(command, this.server, player.socket)
        }
    }

    connect(socket) {
        const player = new this.playerClass(socket)
        this.players.push(player)
        this.SendPlayerCount()
    }

    disconnect(uid) {
        for(let i = 0; i < this.players.length; i++) {
            if(this.players[i].uid == uid) {
                let dcCmd = new Command(OpCode.Disconnect, this.players[i].uid)
                this.Broadcast(dcCmd)
                this.players.splice(i, 1)
                this.SendPlayerCount()
                break
            }
        }
        if(this.players.length == 0)
            process.exit()
    }

    pong(uid) {
        let player = this.GetPlayer(uid)
        let pongCmd = new Command(OpCode.Ping)
        NetCode.Send(pongCmd, this.server, player.socket)
    }

    sendPlayerCount() {
        process.send({ msg: "PlayerCount", args: [this.players.length] })
    }

    connectionStillAlive(uid) {
        let player = this.GetPlayer(uid)
        player.lastseen = Date.now()
    }
    // END OF UNIVERSAL METHODS
}

module.exports = Game

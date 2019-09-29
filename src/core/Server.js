const net = require("net")
const fork = require("child_process").fork
const { OpCode, Command } = require("../utils/Commands.js")
const Matchmaker = require("./Matchmaker.js")

const forkOpts = {
    stdio: [ "pipe", "pipe", "pipe", "ipc" ]
}

/**
 * Represents the base server instance. Start it with `.startServer()`
 */
class Server {
    /**
     * @param {Int} matchmakerPort The port on which the matchmaker server is running
     */
    constructor(matchmakerPort) {
        this.matchmaker = new Matchmaker(matchmakerPort, 100, 2)
        this.lobbies = {}
    }
    /**
     * Starts the server.
     * You should pass as parameter the path of the `createLobby.js` script
     * @param {string} createLobbyScriptPath The path of the `createLobby.js` script.
     */
    start(createLobbyScriptPath, callback) {
        const server = net.createServer(socket => {
            socket.on("error", err => console.log(err))
            socket.on("data", data => {

                let cmd = Command.From(data.buffer)
                console.log(`[Server] Received command ${cmd.GetOpCode()}`)
                switch(cmd.GetOpCode()) {
                    case OpCode.Queue: {
                        // TODO: actual matchmaking
                        /**
                         * @type {Int} Lobby server port
                         */
                        let lobby = this.matchmaker.makeMatch(this.lobbies)

                        if(!this.lobbies[lobby]) {
                            // Spawn a server for the lobby
                            const lobbyServer = fork(createLobbyScriptPath, [lobby], forkOpts)
                            lobbyServer.stdout.on("data", data => console.log(`[${lobby}]: ${data}`)) // Log its console here as '[lobby]: output'
                            lobbyServer.stderr.on("data", data => console.log(`[${lobby}]: ${data}`))
                            lobbyServer.on("message", data => {
                                switch(data.msg) {
                                    case "Online":
                                        this.lobbies[lobby].online = true
                                        break
                                    case "PlayerCount":
                                        this.lobbies[lobby].playerCount = data.args[0]
                                }
                            })
                            lobbyServer.on("exit", () => {
                                // Remove it from the array
                                delete this.lobbies[lobby]
                                console.log(`Killed server ${lobby}`)
                            })
                            // Defaults
                            lobbyServer.online = false
                            lobbyServer.playerCount = 0

                            this.lobbies[lobby] = lobbyServer
                        }

                        let watch = setInterval( () => {
                            if(!this.lobbies[lobby] || !this.lobbies[lobby].online) return
                            let matchCmd = new Command(OpCode.FoundMatch, lobby)
                            socket.write(matchCmd.Buffer)

                            clearInterval(watch)
                        }, 20)

                        break
                    }
                }
            })
        }).listen(this.matchmakerPort, () => console.log(
            `[Server] Listening on port ${server.address().port}`
        ))

        // Optional callback
        if(typeof callback !== "undefined") callback
    }
}

module.exports = Server
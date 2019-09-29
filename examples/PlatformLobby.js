const Lobby = require("../src/core/Lobby.js")
const { OpCode, Command } = require("../utils/Commands.js")


class PlatformLobby extends Lobby {
    constructor(game, player) {
        super(game, player)
    }
    message(data, client) {
        if(data.buffer.length <= 0) return

        let cmd = Command.From(data.buffer)
        let op = cmd.GetOpCode()
        console.log(`got ${OpCode.ToString(op)} from ${client.address}:${client.port}`)

        switch(op) {
            case OpCode.Register:
                this.game.Connect(client)
                this.game.Spawn(client.port)
                break
            case OpCode.Jump: {
                let jumpHeight = cmd.GetAt(0)
                this.game.Jump(client.port, jumpHeight)
                break
            }
            case OpCode.Move: {
                let moveSpeed = cmd.GetAt(0)
                this.game.Move(client.port, moveSpeed)
                break
            }
            case OpCode.Disconnect: {
                this.game.Disconnect(client.port)
                break
            }
            case OpCode.Ping: {
                this.game.Pong(client.port)
                break
            }
        }
        if(op != OpCode.Disconnect)
            this.game.ConnectionStillAlive(client.port)
    }
}

module.exports = PlatformLobby
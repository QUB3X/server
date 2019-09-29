const dgram = require("dgram")
const process = require("process")

class Lobby {
    /**
     * Create a Lobby for a subclass of class Game
     * @param {Game} game The subclass of class Game you want to use
     */
    constructor(game, player) {
        this.server = dgram.createSocket("udp4")
        this.game = new game(this.server, process, player)
        this.game.start()
    }

    error(err) {
        console.log(`error:\n${err.stack}`)
        this.server.close()
        process.exit()
    }
    listening() {
        console.log(`listening on port ${this.server.address().port}`)
        process.send({ msg: "Online", args: [] })
    }
}

module.exports = Lobby
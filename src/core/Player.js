class Player {
    /**
     * Create a Player instance.
     * Player should be extended to your own implementation.
     * @param {Socket} socket
     * @param {x: Float, y: Float}} size Object comprised of the x and y dimensions
     */
    constructor(socket) {
        this.socket = socket
        this.uid = socket.port
        this.state = {}
        this.lastseen = Date.now()
    }
}

module.exports = Player
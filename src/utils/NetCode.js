class NetCode {

    /**
     * Send command to a Player
     * @param {Command} command
     * @param {Socket} from
     * @param {Socket} to
     */
    static Send(command, from, to) {
        from.send(command.Buffer, to.port, to.address)
    }
}

module.exports = NetCode

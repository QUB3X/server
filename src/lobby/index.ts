import Lobby from "./Lobby"

function parseArgv(argv: string[]): Array<[string, string, string]> {
    let _players: Array<[string, string, string]> = []
    let processParams: Array<string> = argv.reverse()
    processParams.pop()
    processParams.pop()

    // unsafe?
    let port = parseInt(processParams.pop() as string)
    if (port === undefined) throw new Error("Could not convert Port to Int, is it a number?")
    if (processParams.length % 3 == 0) {
        for (let i = 0; i < processParams.length; i = i + 3) {
            let player: [string, string, string] = [
                processParams[i],
                processParams[i + 1],
                processParams[i + 2]
            ]
            _players.push(player)
        }
        return _players
    } else {
        throw new Error("Launching Lobby with too few/many parameters")
    }
}

let players: Array<[string, string, string]> = parseArgv(process.argv)

let lobby = new Lobby(port, players)

module.exports = parseArgv
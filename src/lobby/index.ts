import Lobby from "@Lobby/Lobby"
import Player from "@Lobby/Player"

export function parseArgv(argv: string[]): [number, Player[]] {
    let _players: Player[] = []
    let processParams: string[] = argv.reverse()
    processParams.pop()
    processParams.pop()

    let port = parseInt(processParams.pop() as string)
    if (port === undefined)
        throw new Error("Could not convert Port to Int, is it a number?")
    // Get the player tuples
    if (processParams.length % 3 == 0) {
        for (let i = 0; i < processParams.length; i = i + 3) {
            let player: Player = new Player(
                processParams[i], // player id
                processParams[i + 1], // address
                parseInt(processParams[i + 2]) // port
            )
            _players.push(player)
        }
        return [port, _players]
    } else {
        throw new Error("Launching Lobby with too few/many parameters")
    }
}

let parsedArgs = parseArgv(process.argv)

let lobby = new Lobby(parsedArgs[0], parsedArgs[1])

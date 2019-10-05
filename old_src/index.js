const net = require("net")
const fork = require("child_process").fork
const { OpCode, Command } = require("./utils/Commands.js")

const MM_PORT = 50999
const BASE_PORT = 51000
const MAX_LOBBIES = 100
const MAX_PLAYER_COUNT = 2
const forkOpts = {
    stdio: [ "pipe", "pipe", "pipe", "ipc" ]
}

const lobbies = {} // Object of lobbies, port: process

const server = net.createServer(socket => {
    console.log("New client connected")
    socket.on("error", err => console.log(err))
    socket.on("data", data => {
        let cmd = Command.From(data.buffer)
        switch(cmd.GetOpCode()){
            case OpCode.Queue:{
                // TODO: actual matchmaking
                let lobby = Matchmake()

                if(!lobbies[lobby]){
                    // Spawn a server for the lobby
                    const lobbyServer = fork("src/lobby/lobby.js", [lobby], forkOpts)
                    lobbyServer.stdout.on("data", data => console.log(`[${lobby}]: ${data}`)) // Log its console here as '[lobby]: output'
                    lobbyServer.stderr.on("data", data => console.log(`[${lobby}]: ${data}`))
                    lobbyServer.on("message", data => {
                        switch(data.msg){
                            case "Online":
                                lobbies[lobby].online = true
                                break
                            case "PlayerCount":
                                lobbies[lobby].playerCount = data.args[0]
                        }
                    })
                    lobbyServer.on("exit", () => {
                        // Remove it from the array
                        delete lobbies[lobby]
                        console.log(`Killed server ${lobby}`)
                    })
                    // Defaults
                    lobbyServer.online = false
                    lobbyServer.playerCount = 0

                    lobbies[lobby] = lobbyServer
                }

                let watch = setInterval( () => {
                    if(!lobbies[lobby] || !lobbies[lobby].online) return
                    let matchCmd = new Command(OpCode.FoundMatch, lobby)
                    socket.write(matchCmd.Buffer)

                    clearInterval(watch)
                }, 20)

                break
            }
        }
    })
})
    .listen(MM_PORT, () => console.log(`master server listening on port ${server.address().port}`))

function Matchmake(){
    let freePorts = []
    let lobbyPorts = Object.keys(lobbies)
    for(let i = 0; i < lobbyPorts.length; i++){
        let _lobby = lobbies[lobbyPorts[i]]
        if(_lobby.online && _lobby.playerCount < MAX_PLAYER_COUNT)
            freePorts.push(lobbyPorts[i])
    }

    let ret
    if(freePorts.length > 0){
        ret = freePorts[Math.floor(Math.random() * freePorts.length)]
    }
    else{
        // New random port
        do {
            ret = BASE_PORT + Math.floor(Math.random() * MAX_LOBBIES)
        } while(lobbies[ret] != undefined)
    }

    return ret
}

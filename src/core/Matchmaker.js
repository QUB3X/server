class Matchmaker {
    constructor(basePort, maxLobbies, maxPlayerCount) {
        this.basePort = basePort
        this.maxLobbies = maxLobbies
        this.maxPlayerCount = maxPlayerCount
    }

    makeMatch(lobbies) {
        let freePorts = []
        let lobbyPorts = Object.keys(lobbies)
        for(let i = 0; i < lobbyPorts.length; i++) {
            let _lobby = lobbies[lobbyPorts[i]]
            if(_lobby.online && _lobby.playerCount < this.maxLobbies)
                freePorts.push(lobbyPorts[i])
        }

        let ret
        if(freePorts.length > 0) {
            ret = freePorts[Math.floor(Math.random() * freePorts.length)]
        }
        else{
            // New random port
            do {
                ret = this.basePort + Math.floor(Math.random() * this.maxLobbies)
            } while(lobbies[ret] != undefined)
        }

        return ret
    }
}

module.exports = Matchmaker
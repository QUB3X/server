const Path = require("path")
const Server = require("../src/core/Server.js")

const createLobbyScriptPath = Path.relative("../src/core/Server.js", "./createLobby.js")

const server = new Server(50999)

server.start(createLobbyScriptPath)

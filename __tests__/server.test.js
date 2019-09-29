// Imports
const Path = require("path")
const Server = require("../src/core/Server.js")
const createLobbyScriptPath = Path.relative("../src/core/Server.js", "../examples/createLobby.js")
// We'll start another server acting as a client for the server
const dgram = require("dgram")
const client = dgram.createSocket("udp4")
const { OpCode, Command } = require("../src/utils/Commands.js")

const MM_PORT = 50999

const server = new Server(MM_PORT)

// Start the server
server.start(createLobbyScriptPath, startClient())


function startClient() {


    client.connect(MM_PORT)
    client.on("error", (err) => {
        console.log(`[Client] Error:\n${err.stack}`)
        client.close()
    })

    client.on("message", (msg, rinfo) => {
        console.log(`[Client] Got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    })

    client.on("listening", () => {
        const address = client.address()
        console.log(`[Client] Listening ${address.address}:${address.port}`);
    })


    const testCommand = new Command(OpCode.Register).Buffer

    client.send(testCommand, MM_PORT, () => console.log("[Client] Sent testCommand 1"))



}
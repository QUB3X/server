"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lobby_1 = require("@Lobby/Lobby");
const Player_1 = require("@Lobby/Player");
function parseArgv(argv) {
    let _players = [];
    let processParams = argv.reverse();
    processParams.pop();
    processParams.pop();
    let port = parseInt(processParams.pop());
    if (port === undefined)
        throw new Error("Could not convert Port to Int, is it a number?");
    // Get the player tuples
    if (processParams.length % 3 == 0) {
        for (let i = 0; i < processParams.length; i = i + 3) {
            let player = new Player_1.default(processParams[i], // player id
            processParams[i + 1], // address
            parseInt(processParams[i + 2]) // port
            );
            _players.push(player);
        }
        return [port, _players];
    }
    else {
        throw new Error("Launching Lobby with too few/many parameters");
    }
}
exports.parseArgv = parseArgv;
let parsedArgs = parseArgv(process.argv);
let lobby = new Lobby_1.default(parsedArgs[0], parsedArgs[1]);
//# sourceMappingURL=index.js.map
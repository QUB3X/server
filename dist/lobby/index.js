"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Lobby_1 = __importDefault(require("./Lobby"));
let players = [];
let processParams = process.argv.reverse();
processParams.pop();
processParams.pop();
let port = parseInt(processParams.pop());
if (processParams.length % 3 == 0) {
    for (let i = 0; i < processParams.length; i = i + 3) {
        let player = [
            processParams[i],
            processParams[i + 1],
            processParams[i + 2]
        ];
        players.push(player);
    }
}
else {
    console.log(`Launching Lobby with too few/many parameters`);
}
let lobby = new Lobby_1.default(port);
//# sourceMappingURL=index.js.map
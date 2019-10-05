"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dgram_1 = __importDefault(require("dgram"));
class Lobby {
    constructor(port) {
        this.server = dgram_1.default.createSocket("udp4");
        this.server.bind(port);
    }
    start() {
        this.server.on("error", (err) => {
            console.log(`[Lobby] Error:\n${err.stack}`);
            this.server.close();
        });
    }
}
module.exports = Lobby;
//# sourceMappingURL=Lobby.js.map
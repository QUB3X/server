"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = require("dgram");
class Lobby {
    constructor(port, players) {
        this.server = dgram_1.createSocket("udp4");
        this.server.bind(port);
    }
    start() {
        this.server.on("error", (err) => {
            console.log(`[Lobby] Error:\n${err.stack}`);
            this.server.close();
        });
    }
}
exports.default = Lobby;
//# sourceMappingURL=Lobby.js.map
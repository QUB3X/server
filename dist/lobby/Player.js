"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(id, address, port) {
        this._id = id;
        this._address = address;
        this._port = port;
    }
    get id() {
        return this._id;
    }
    get address() {
        return this._address;
    }
    get port() {
        return this._port;
    }
}
exports.default = Player;
//# sourceMappingURL=Player.js.map
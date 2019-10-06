import Player from "@Lobby/Player";
export default class Lobby {
    private server;
    constructor(port: number, players: Player[]);
    start(): void;
}

const {Command, OpCode} = require("../src/utils/Commands.js")
const NetCode = require("../src/utils/NetCode.js")
const Game = require("../src/core/Game.js")

class PlatformGame extends Game {
    constructor(serverSocket, process, deltaTime, playerClass) {
        super(serverSocket, process, deltaTime, playerClass)

        // Constants
        this.GRAVITY = -9.81 * 1.5
        this.GROUND = 0
        this.A_BIT = 0.05
    }

    spawn(uid) {
        let player = this.GetPlayer(uid)

        player.state.pos = { x: Math.random() * 10 - 5, y: 1 }
        player.state.vel = { x: 0, y: 0 }

        // Spawn player
        let spawnCmd = new Command(OpCode.Spawn, player.uid, player.state.pos.x, player.state.pos.y)
        this.Broadcast(spawnCmd, this.server, this.players)

        // Spawn other players in the same lobby
        let spawnOthersCmd = new Command(OpCode.Spawn)
        for(let other of this.players) {
            if(other.uid != player.uid) {
                spawnOthersCmd.SetAt(0, other.uid)
                spawnOthersCmd.SetAt(1, other.state.pos.x)
                spawnOthersCmd.SetAt(2, other.state.pos.y)
                NetCode.Send(spawnOthersCmd, this.server, player.socket)
            }
        }
    }

    jump(uid, jumpHeight) {
        let player = this.GetPlayer(uid)
        if(player.state.isGrounded)
            player.input.nextJump = jumpHeight
    }

    move(uid, moveSpeed) {
        let player = this.GetPlayer(uid)
        player.input.x = moveSpeed
    }

    physicsTick() {
        let playerData = []

        for(let i = 0; i < this.players.length; i++) {
            let player = this.players[i]

            player.state.vel.x = player.input.x
            this.computeIsGrounded(player)
            this.computeGravity(player)
            this.computeCollisions(player)
            this.computeMovement(player)

            // Populate the command buffer
            playerData.push(player.uid)
            playerData.push(player.state.pos.x)
            playerData.push(player.state.pos.y)
            playerData.push(player.state.vel.x)
            playerData.push(player.state.vel.y)
        }

        let posCmd = new Command(OpCode.SetPos, ...playerData)
        this.Broadcast(posCmd, this.server, this.players)
    }

    computeIsGrounded(player) {
        player.state.isGrounded = false
        if(player.state.pos.y <= this.GROUND + this.A_BIT) {
            player.state.pos.y = this.GROUND
            player.state.isGrounded = true
        } else {
            for(let j = 0; j < this.players.length && !player.state.isGrounded; j++) {
                let other = this.players[j]
                if(other.uid != player.uid) {
                    if(player.isGroundedOn(other)) {
                        player.state.pos.y = other.state.pos.y + other.size.y / 2 + player.size.y / 2
                        player.state.isGrounded = true
                    }
                }
            }
        }
    }

    computeGravity(player) {
        if(player.state.isGrounded) {
            player.state.vel.y = 0
            // Setting velocity to 0 would stop jumping
            if(player.input.nextJump) {
                player.state.vel.y += player.input.nextJump
                player.input.nextJump = null
            }
        } else {
            player.state.vel.y += this.GRAVITY * this.DELTATIME
        }
    }

    // Check for lateral collision
    computeCollisions(player) {
        player.state.collided = false
        for(let j = 0; j < this.players.length && !player.state.collided; j++) {
            let other = this.players[j]
            if(other.uid != player.uid) {
                let touch = player.isTouchingHorizontal(other)
                if((touch > 0 && player.state.vel.x > 0) ||
                    (touch < 0 && player.state.vel.x < 0)) {
                    player.state.vel.x = 0
                }
            }
        }
    }

    computeMovement(player) {
        // Apply Velocity
        player.state.pos.x += player.state.vel.x * this.DELTATIME
        player.state.pos.y += player.state.vel.y * this.DELTATIME
    }
}

module.exports = PlatformGame
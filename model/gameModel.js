const mongoose = require("mongoose");
const gameSchema = new mongoose.Schema({
    playerX: {
        name: {
            type: String
        },
        uid: {
            type: String
        }
    },
    playerO: {
        name: {
            type: String
        },
        uid: {
            type: String
        }
    },
    board: {
        type: Array,
        default: Array(9).fill({mark: "", winning: false})
    },
    turn: {
        playerid: {
            type: String
        },
        mark: {
            type: String
        }
    },
    winner: {
        type: String
    },
    looser: {
        type: String
    },
    draw: {
        type: Boolean,
        default: false
    },
    noofturns: {
        type: Number,
        default: 9
    }
})
const Game = mongoose.model("games", gameSchema);
module.exports = Game;
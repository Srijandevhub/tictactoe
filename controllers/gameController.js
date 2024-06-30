const Game = require("../model/gameModel");

const createNewGame = async (req, res) => {
    try {
        const { playerX_id, playerX_name } = req.body;
        const newGame = new Game({
            playerX: {
                name: playerX_name,
                uid: playerX_id
            },
            turn: {
                playerid: playerX_id,
                mark: "X"
            }
        });
        await newGame.save();
        res.status(200).json(newGame);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}
const joinGame = async (req, res) => {
    try {
        const { id } = req.params;
        const { playerO_id, playerO_name } = req.body;
        const game = await Game.findById(id);
        if (!game) {
            return res.status(404).json({
                "message": "This game does not exists"
            })
        }
        if (!game.playerO) {
            return res.status(405).json({
                "Message": "Waiting for player 2"
            })
        }
        const playerOId = playerO_id;
        const playerOName = playerO_name;
        const updateGame = await Game.findByIdAndUpdate(id, {
            playerO: {
                name: playerOName,
                uid: playerOId
            }
        });
        res.status(200).json(updateGame);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}
const getGame = async (req, res) => {
    try {
        const { id } = req.params;
        const game = await Game.findById(id);
        if (!game) {
            return res.status(400).json({
                "message": "Game not found"
            })
        }
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}
const move = async (req, res) => {
    try {
        const { index, playerid } = req.body;
        const { id } = req.params;
        const game = await Game.findById(id);
        if (playerid !== game.turn.playerid) {
            return res.status(400).json({
                "message": "Its Not Your Turn"
            })
        }
        if (game.board[index].mark === "X" || game.board[index].mark === "O") {
            return res.status(400).json({
                "message": "Already checked"
            })
        }
        if (game.turn.mark === "X") {
            game.board[index].mark = "X";
        } else if (game.turn.mark === "O") {
            game.board[index].mark = "O";
        }
        game.noofturns = game.noofturns - 1;
        if (checkWin(game.board, game.turn.mark)) {
            game.winner = game.turn.playerid;
            game.looser = game.turn.playerid === game.playerX.uid ? game.playerO.uid : game.playerX.uid;
        } 
        if (checkWin(game.board, game.turn.mark) === false && game.noofturns === 0) {
            game.draw = true;
        }
        if (game.turn.mark === "X") {
            game.turn.mark = "O";
            game.turn.playerid = game.playerO.uid
        } else if (game.turn.mark === "O") {
            game.turn.mark = "X";
            game.turn.playerid = game.playerX.uid
        }
        await Game.findByIdAndUpdate(id, game);
        res.status(200).json({
            game
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

function checkWin(board, mark) {
    const winCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < winCombinations.length; i++) {
        const [a, b, c] = winCombinations[i];
        if (board[a].mark === mark && board[b].mark=== mark && board[c].mark === mark) {
            return true;
        }
    }
    return false;
}

const deleteGame = async (req, res) => {
    try {
        const { id } = req.params;
        await Game.findByIdAndDelete(id);
        res.status(200).json({"Message": "Deleted"});
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

module.exports = { createNewGame, joinGame, getGame, move, deleteGame };
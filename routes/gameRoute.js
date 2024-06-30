const express = require("express");
const { createNewGame, joinGame, getGame, move, deleteGame } = require("../controllers/gameController");
const router = express.Router();

router.post("/create", createNewGame);
router.put("/join/:id", joinGame);
router.get("/get/:id", getGame);
router.put("/move/:id", move);
router.delete("/delete/:id", deleteGame);

module.exports = router;
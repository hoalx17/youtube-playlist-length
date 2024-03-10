const express = require("express");

const { playlistController } = require("./controller");

const router = express.Router();

/** Playlist Router */
router.get("/", playlistController.getPlaylistLengthController);

module.exports = router;

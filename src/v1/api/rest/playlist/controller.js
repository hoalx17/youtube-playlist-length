const chalk = require("chalk");
const { StatusCodes } = require("http-status-codes");
const moment = require("moment");

const { getPlaylistLength } = require("./service");
const { ON_RELEASE } = require("../../../../../constant");
const { CODE, MSG } = require("./constant");
const { createCriticalError } = require("../../../error");
const { responseFindOne } = require("./response");
const { dayStringFromMilliseconds } = require("./util");

/** Playlist Controller */
const getPlaylistLengthController = async (req, res, next) => {
  try {
    const { playlistUrl, endIndex, startIndex = 1, speed = 2 } = req.query;
    const { originIds, uniqueIds, duplicatedIds, totalOriginItemDuration, totalUniqueItemDuration } = await getPlaylistLength(
      playlistUrl,
      endIndex,
      startIndex
    );
    const payload = {
      length: [originIds.length, uniqueIds.length],
      duplicatedIds,
      unix: [totalOriginItemDuration, totalUniqueItemDuration],
      duration: [
        dayStringFromMilliseconds(totalOriginItemDuration),
        dayStringFromMilliseconds(totalUniqueItemDuration),
        dayStringFromMilliseconds(totalUniqueItemDuration / speed),
      ],
    };
    responseFindOne(res, payload, MSG.GET_PLAYLIST_ITEMS_SUCCESS);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.GET_PLAYLIST_LENGTH_FAILURE, MSG.GET_PLAYLIST_LENGTH_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  playlistController: {
    getPlaylistLengthController,
  },
};

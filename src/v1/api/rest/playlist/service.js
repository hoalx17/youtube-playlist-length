const chalk = require("chalk");
const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const { default: axios, HttpStatusCode } = require("axios");
const moment = require("moment");

const { ON_RELEASE } = require("../../../../../constant");
const { CODE, MSG, ERR } = require("./constant");
const { throwCriticalError } = require("../../../error");
const { truthyValidator, numericValidator } = require("./validator");

const { YOUTUBE_DATA_API_KEY } = process.env;

const getPlaylistItemIds = async (playListURL, endIndex, startIndex = 1) => {
  try {
    /** Ensure Playlist URL not empty and valid, startIndex and endIndex are numeric */
    truthyValidator(ERR.PLAYLIST_URL_MUST_NOT_EMPTY, CODE.PLAYLIST_URL_MUST_NOT_EMPTY, MSG.PLAYLIST_URL_MUST_NOT_EMPTY, playListURL);
    numericValidator(ERR.START_END_INDEX_MUST_BE_NUMERIC, CODE.START_END_INDEX_MUST_BE_NUMERIC, MSG.START_END_INDEX_MUST_BE_NUMERIC, endIndex, startIndex);
    let pageToken;
    let continueSync = true;
    const playlistItemIds = [];
    const playListId = /[&?]list=([a-z0-9_-]+)/i.exec(playListURL)?.[1];
    if (!playListId) {
      const error = new Error(ERR.INVALID_PLAYLIST_URL);
      ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.INVALID_PLAYLIST_URL, MSG.INVALID_PLAYLIST_URL, StatusCodes.BAD_REQUEST);
    }
    /** Sync Playlist via ID */
    do {
      const playListAPI = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playListId}&pageToken=${
        pageToken || ""
      }&key=${YOUTUBE_DATA_API_KEY}`;
      console.log(`Sync Playlist: ${chalk.yellow(playListAPI)}`);
      const response = await axios.get(playListAPI, { responseType: "json" });
      const items = response.data?.items;
      const itemIds = items.map((v, i, o) => v.contentDetails.videoId);
      playlistItemIds.push(...itemIds);
      /** Skip Sync PlaylistItems when startIndex and endIndex not in first and last sync time, not work correctly */
      if (endIndex <= 50) {
        continueSync = false;
      } else if (response.data?.nextPageToken) {
        pageToken = response.data?.nextPageToken;
      } else {
        continueSync = false;
      }
    } while (continueSync);
    return { originIds: playlistItemIds, uniqueIds: _.uniq(playlistItemIds) };
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    if (error.response?.status == HttpStatusCode.NotFound) {
      throwCriticalError(error, CODE.PLAYLIST_NOT_FOUND, MSG.PLAYLIST_NOT_FOUND, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    throwCriticalError(error, CODE.GET_PLAYLIST_ITEMS_FAILURE, MSG.GET_PLAYLIST_ITEMS_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const getItemDurations = async (itemIds) => {
  try {
    const ids = _.chunk(itemIds, 50);
    const rawItemDuration = await Promise.all(
      ids.map(async (v, i, o) => {
        const itemsAPI = `https://www.googleapis.com/youtube/v3/videos?id=${v.toString()}&part=contentDetails&key=${YOUTUBE_DATA_API_KEY}`;
        console.log(`Sync Item: ${chalk.yellow(itemsAPI)}`);
        const response = await axios.get(itemsAPI, { responseType: "json" });
        const items = response.data?.items;
        const itemDurations = items.map((v, i, o) => {
          const duration = v?.contentDetails?.duration;
          return moment.duration(duration).asMilliseconds();
        });
        return itemDurations;
      })
    );
    return _.flattenDepth(rawItemDuration);
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.GET_ITEMS_DURATION_FAILURE, MSG.GET_ITEMS_DURATION_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const getPlaylistLength = async (playListURL, endIndex, startIndex = 1) => {
  try {
    const { originIds, uniqueIds } = await getPlaylistItemIds(playListURL, endIndex, startIndex);
    const uniqueItemDurations = await getItemDurations(uniqueIds.slice(parseInt(startIndex), parseInt(endIndex) + 1));
    if (originIds.length === uniqueIds.length) {
      return {
        originIds,
        uniqueIds,
        duplicatedIds: [],
        originItemDurations: uniqueItemDurations,
        uniqueItemDurations,
        totalOriginItemDuration: _.sum(uniqueItemDurations),
        totalUniqueItemDuration: _.sum(uniqueItemDurations),
      };
    } else {
      const originItemDurations = await getItemDurations(uniqueIds.slice(parseInt(startIndex), parseInt(endIndex) + 1));
      return {
        originIds,
        uniqueIds,
        duplicatedIds: _.filter(originIds, (v, i, o) => _.includes(o, v, i + 1)),
        originItemDurations,
        uniqueItemDurations,
        totalOriginItemDuration: _.sum(originItemDurations),
        totalUniqueItemDuration: _.sum(uniqueItemDurations),
      };
    }
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.GET_PLAYLIST_LENGTH_FAILURE, MSG.GET_PLAYLIST_LENGTH_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getPlaylistLength,
};

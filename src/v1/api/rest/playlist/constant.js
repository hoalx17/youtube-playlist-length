module.exports = {
  CODE: {
    /** Transform */

    /** Validator */
    VALIDATE_FAILURE: "ERR_PLAYLIST_VALIDATION_1",
    PLAYLIST_URL_MUST_NOT_EMPTY: "ERR_PLAYLIST_VALIDATION_2",
    START_END_INDEX_MUST_BE_NUMERIC: "ERR_PLAYLIST_VALIDATOR_3",
    INVALID_PLAYLIST_URL: "ERR_PLAYLIST_VALIDATION_4",

    /** Repository */

    /** Service */
    GET_PLAYLIST_LENGTH_FAILURE: "ERR_PLAYLIST_SERVICE_1",
    GET_PLAYLIST_ITEMS_FAILURE: "ERR_PLAYLIST_SERVICE_2",
    PLAYLIST_NOT_FOUND: "ERR_PLAYLIST_SERVICE_3",
    GET_ITEMS_DURATION_FAILURE: "ERR_PLAYLIST_SERVICE_4",
  },
  MSG: {
    /** Transform */

    /** Validator */
    VALIDATOR_FAILURE: "Validator on Schema return failure!",
    PLAYLIST_URL_MUST_NOT_EMPTY: "Playlist url must not empty!",
    START_END_INDEX_MUST_BE_NUMERIC: "Start index, and end index must be numeric and not be empty!",
    INVALID_PLAYLIST_URL: "Provide is not Youtube url playlist!",

    /** Repository */

    /** Service */
    GET_PLAYLIST_LENGTH_FAILURE: "Get Youtube Playlist length failure!",
    GET_PLAYLIST_LENGTH_SUCCESS: "Get Youtube Playlist length success!",
    GET_PLAYLIST_ITEMS_FAILURE: "Get Playlist Items failure!",
    PLAYLIST_NOT_FOUND: "Playlist not found with provide id!",
    GET_PLAYLIST_ITEMS_SUCCESS: "Get Playlist Items success!",
    GET_ITEMS_DURATION_FAILURE: "Get Playlist Items duration failure!",
    GET_ITEMS_DURATION_SUCCESS: "Get Playlist Items duration success!",
  },

  ERR: {
    PLAYLIST_URL_MUST_NOT_EMPTY: "playlist url must not be empty",
    START_END_INDEX_MUST_BE_NUMERIC: "start, end index must be numeric",
    INVALID_PLAYLIST_URL: "url is not in youtube playlist format",
    PLAYLIST_NOT_FOUND: "playlist not found with provide id",
  },
};

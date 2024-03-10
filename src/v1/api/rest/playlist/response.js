const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const _ = require("lodash");

const { MSG } = require("./constant");
const { Response, ResponseMetadata, ResponseError } = require("../../../../../response");

const responseFindOne = (res, target, msg) => {
  const statusCode = !_.isEmpty(target) ? StatusCodes.OK : StatusCodes.NO_CONTENT;
  const metadata = !_.isEmpty(target)
    ? new ResponseMetadata(StatusCodes.OK, ReasonPhrases.OK)
    : new ResponseMetadata(StatusCodes.NO_CONTENT, ReasonPhrases.NO_CONTENT);
  const message = msg || !_.isEmpty(target) ? MSG.QUERY_TARGET_SUCCESS : MSG.QUERY_TARGET_NO_CONTENT;
  const error = new ResponseError(null, false);
  const payload = _.isEmpty(target) || target;
  const pagination = null;
  const hateos = null;
  res.status(statusCode).json(new Response(metadata, error, message, payload, pagination, hateos));
};

module.exports = {
  responseFindOne,
};

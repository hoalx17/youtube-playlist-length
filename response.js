const { StatusCodes, ReasonPhrases, getReasonPhrase } = require("http-status-codes");

const { CODE, MSG } = require("./constant");

class ResponseMetadata {
  constructor(statusCode, statusText) {
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}

class ResponseError {
  constructor(code, missing) {
    this.code = code;
    this.missing = missing;
  }
}

class ResponsePayload {
  constructor(payload) {
    this.payload = payload;
  }
}

class ResponsePagination {
  constructor(page, size, total, cursor) {
    this.page = page;
    this.size = size;
    this.total = total;
    this.cursor = cursor;
  }
}

class ResponseHateos {
  constructor(...hypermedia) {
    this.hypermedia = hypermedia;
  }
}

class Response {
  constructor(metadata, error, message, payload, pagination, hateos) {
    this.metadata = metadata;
    this.error = error;
    this.message = message;
    this.payload = payload;
    this.pagination = pagination;
    this.hateos = hateos;
  }
}

const responseNotFound = (res) => {
  const metadata = new ResponseMetadata(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
  const error = new ResponseError(CODE.RESOURCE_NOT_FOUND, false);
  const message = MSG.RESOURCES_NOT_FOUND;
  const payload = null;
  const pagination = null;
  const hateos = null;
  res.status(StatusCodes.NOT_FOUND).json(new Response(metadata, error, message, payload, pagination, hateos));
};

const responseServerError = (err, res) => {
  const statusCode = err.options?.statusCode || err.httpStatusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const metadata = new ResponseMetadata(statusCode, getReasonPhrase(statusCode));
  const error = new ResponseError(err.options?.code || err.code || CODE.SERVER_CANNOT_RESPONSE, err.options?.missing || err.missing || false);
  const message = err.options?.message || err.message || MSG.SERVER_CANNOT_RESPONSE;
  const payload = null;
  const pagination = null;
  const hateos = null;
  res.status(statusCode).json(new Response(metadata, error, message, payload, pagination, hateos));
};

module.exports = {
  Response,
  ResponseError,
  ResponseMetadata,
  ResponsePayload,
  ResponsePagination,
  ResponseHateos,
  responseNotFound,
  responseServerError,
};

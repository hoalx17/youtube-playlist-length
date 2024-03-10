const createError = require("http-errors");
const { StatusCodes } = require("http-status-codes");

const { ON_RELEASE } = require("../../constant");

class CriticalError extends Error {
  constructor(message, options) {
    super(message);
    this.options = options;
  }
}

class NormalError extends Error {
  constructor(message, options) {
    super(message);
    this.options = options;
  }
}

const throwCriticalError = (error, code, message, statusCode) => {
  throw new CriticalError(error.message, {
    code: error.options?.code ?? code,
    missing: error.options?.missing ?? false,
    message: !ON_RELEASE ? error.message : message,
    statusCode: error.options?.statusCode ?? statusCode,
  });
};

const throwNormalError = (error, code, message, statusCode) => {
  throw new NormalError(error.message, {
    code: error.options?.code ?? code,
    missing: error.options?.missing ?? true,
    message: !ON_RELEASE ? error.message : message,
    statusCode: error.options?.statusCode ?? statusCode,
  });
};

const newCriticalError = (error, code, message, statusCode) =>
  new CriticalError(error.message, {
    code: error.options?.code ?? code,
    missing: error.options?.missing ?? false,
    message: !ON_RELEASE ? error.message : message,
    statusCode: error.options?.statusCode ?? statusCode,
  });

const newNormalError = (error, code, message, statusCode) =>
  new NormalError(error.message, {
    code: error.options?.code ?? code,
    missing: error.options?.missing ?? true,
    message: !ON_RELEASE ? error.message : message,
    statusCode: error.options?.statusCode ?? statusCode,
  });

const createCriticalError = (error, code, message, statusCode) =>
  createError(StatusCodes.INTERNAL_SERVER_ERROR, message, {
    code: error.options?.code ?? code,
    missing: error.options?.missing ?? false,
    message: !ON_RELEASE ? error.message : message,
    httpStatusCode: error.options?.statusCode ?? statusCode,
  });

const createNormalError = (error, code, message, statusCode) =>
  createError(StatusCodes.INTERNAL_SERVER_ERROR, message, {
    code: error.options?.code ?? code,
    missing: error.options?.missing ?? true,
    message: !ON_RELEASE ? error.message : message,
    httpStatusCode: error.options?.statusCode ?? statusCode,
  });

module.exports = {
  throwCriticalError,
  throwNormalError,
  createCriticalError,
  createNormalError,
  newCriticalError,
  newNormalError,
};

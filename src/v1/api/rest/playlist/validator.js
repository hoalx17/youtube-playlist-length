const chalk = require("chalk");
const { StatusCodes } = require("http-status-codes");

const { CODE, MSG } = require("./constant");
const { throwCriticalError } = require("../../../error");
const { ON_RELEASE } = require("../../../../../constant");

const truthyValidator = function (errMsg, code, msg, ...args) {
  try {
    const isAllTruthy = Object.values(arguments)
      .slice(3)
      .every((v) => !!v);
    if (!isAllTruthy) {
      const error = new Error(errMsg);
      ON_RELEASE || console.log(`Validator: ${chalk.red(error.message)}`);
      throwCriticalError(error, code, msg, StatusCodes.BAD_REQUEST);
    }
    return isAllTruthy;
  } catch (error) {
    ON_RELEASE || console.log(`Validator: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.VALIDATE_FAILURE, MSG.VALIDATOR_FAILURE, StatusCodes.BAD_REQUEST);
  }
};

const numericValidator = function (errMsg, code, msg, ...args) {
  try {
    const isAllNumeric = Object.values(arguments)
      .slice(3)
      .every((v) => parseInt(v));
    if (!isAllNumeric) {
      const error = new Error(errMsg);
      ON_RELEASE || console.log(`Validator: ${chalk.red(error.message)}`);
      throwCriticalError(error, code, msg, StatusCodes.BAD_REQUEST);
    }
    return isAllNumeric;
  } catch (error) {
    ON_RELEASE || console.log(`Validator: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.VALIDATE_FAILURE, MSG.VALIDATOR_FAILURE, StatusCodes.BAD_REQUEST);
  }
};

module.exports = {
  truthyValidator,
  numericValidator,
};

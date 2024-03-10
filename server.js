const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const chalk = require("chalk");
const { default: helmet } = require("helmet");
const express = require("express");
const path = require("path");

const routeConfig = require("./route");
const { ON_RELEASE, MSG } = require("./constant");
const { responseNotFound, responseServerError } = require("./response");

const serverConfig = async (app) => {
  /* Server's Middleware */
  app.use(helmet());
  app.use(compression());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));
  ON_RELEASE || app.use(morgan("combined"));

  /* Database Connection */

  /** Route's Config */
  try {
    await routeConfig(app);
    ON_RELEASE || console.log(chalk.green(MSG.ROUTE_ENDPOINT_ESTABLISHED_SUCCESS));
  } catch (error) {
    ON_RELEASE || console.error(chalk.red(`${MSG.ROUTE_ENDPOINT_ESTABLISHED_FAILURE}: ${error.message}`));
    process.exit(2);
  }

  /** Error Handling */
  app.use((req, res, next) => responseNotFound(res));
  app.use((err, req, res, next) => responseServerError(err, res));
};

module.exports = serverConfig;

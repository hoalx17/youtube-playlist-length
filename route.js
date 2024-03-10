const { route: playlistRouter } = require("./src/v1/api/rest/playlist");

const routeConfig = async (app) => {
  app.use("/api/v1/playlist", playlistRouter);
};

module.exports = routeConfig;

const { PORT, NODE_ENV } = process.env;

module.exports = {
  ON_RELEASE: NODE_ENV === "production",

  CODE: {
    /** Server Constant */
    RESOURCE_NOT_FOUND: "ERNF",
    SERVER_CANNOT_RESPONSE: "ESCR",
  },
  MSG: {
    /** Server Constant */
    RESOURCES_NOT_FOUND: `Resources not found! Please check APIs documentation for more information!`,
    SERVER_CANNOT_RESPONSE: `Server cannot send response right now because unknown exception!`,
    SERVER_START_SUCCESS: `Server is running at address: http://localhost:${PORT}!`,
    SERVER_START_FAILURE: `Server start failure. Please check log file to get more information!`,

    /** Route Constant */
    ROUTE_ENDPOINT_ESTABLISHED_SUCCESS: "Route endpoint has been established successfully!",
    ROUTE_ENDPOINT_ESTABLISHED_FAILURE: "Unable to configure route endpoint!",

    /** CLI Constants */
    CLI_EXECUTION_SUCCESS: "CLI has been executed successfully",
    CLI_EXECUTION_FAILURE: "Unable to executed CLI",
  },
};

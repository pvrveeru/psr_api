const { status: httpStatus } = require("http-status");
const logger = require("../config/logger");

const handleCatch = (res, error, defaultMessage) => {
  logger.error(defaultMessage + "" + error.message);
  const statusCode = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message =
    error?.message || defaultMessage || "An unexpected error occurred.";

  res.status(statusCode).json({
    statusCode,
    status: "error",
    message: defaultMessage || "An error occurred.",
    error: message,
  });
};

module.exports = handleCatch;

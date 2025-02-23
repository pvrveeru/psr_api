const { validationResult } = require("express-validator");
exports.validation = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      message: "Invalid request",
      statusCode: 422,
      data: {},
      errors: errors.array(),
    });
  } else {
    next();
  }
};

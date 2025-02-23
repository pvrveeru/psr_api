const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");
const { status: httpStatus } = require("http-status");
const ApiError = require("../utils/ApiError");

const verifyToken = async (token) => {
  if (!token) {
    new ApiError(httpStatus.UNAUTHORIZED, "Access denied. No token provided.");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let loginData;
    if (decoded?.userId) {
      loginData = await userService.getUserById(decoded?.userId);
    } else {
      return new ApiError(httpStatus.FORBIDDEN, "Invalid token.");
    }

    if (loginData) {
      return loginData; // Attach decoded token payload to the request object
    } else {
      return new ApiError(httpStatus.NOT_FOUND, "User Not Found.");
    }
  } catch (err) {
    console.error(err);
    if (err?.statusCode) {
      throw new ApiError(err.statusCode, err?.message);
    } else {
      throw new ApiError(httpStatus.FORBIDDEN, "Invalid or expired token.");
    }
  }
};

module.exports = verifyToken;

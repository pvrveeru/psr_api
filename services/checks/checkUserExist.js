const User = require("../../models/user");
const ApiError = require("../../utils/ApiError"); // Custom error handling
const { status: httpStatus } = require("http-status"); // Correct import

const checkUserExist = async (req, res, next) => {
  try {
    const { userId } = req.params; // Extract userId and eventId from params

    if (userId) {
      // Step 1: Check if the user exists
      const userExists = await User.findOne({ where: { userId: userId } });
      if (!userExists) {
        return next(new ApiError(httpStatus.NOT_FOUND, "User not found"));
      }
    }

    // If both user and event exist, proceed to the next middleware
    next();
  } catch (error) {
    return next(
      new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        false,
        error.stack
      )
    );
  }
};

module.exports = { checkUserExist };

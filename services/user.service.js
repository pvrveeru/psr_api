const User = require("../models/user"); // Adjust the path as needed
const { status: httpStatus } = require("http-status");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const OTPVerification = require("../models/otpVerification");
const { Op, sql } = require("@sequelize/core");
const { Sequelize } = require("@sequelize/core");
// Service to create a user
const loginUser = async (userData, otp) => {
  if (!userData.phoneNumber) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Phone number is required");
  }
  try {
    const user = await User.findOne({
      where: {
        phoneNumber: userData.phoneNumber,
        accountStatus: 1, // Only fetch active users
      },
      raw: true,
    });
    console.log(userData.deviceId, user.deviceId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    if (user.setDeviceId && user.deviceId) {
      if (user.deviceId !== userData.deviceId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "deviceId is not valid");
      }
    } else if (user.setDeviceId && !user.deviceId) {
      await user.update({ deviceId: userData.deviceId });
    } else if (!user.setDeviceId) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "contact admin for adding device Id"
      );
    }
    // Ensure the phoneNumber is extracted properly (depending on your model)
    const phoneNumber = user.phoneNumber || userData.phoneNumber;

    // Create OTP entry
    const [otpData, otpCreated] = await OTPVerification.upsert(
      {
        phoneNumber: phoneNumber,
        otpCode: otp,
        expiresAt: new Date(new Date().getTime() + 5 * 60000), // Expires in 5 minutes
      },
      { returning: true }
    );
    return otpData;
  } catch (error) {
    logger.error(
      "Error :: user.service :: createUser :: " + error.stack || error.message
    );
    throw new ApiError(httpStatus.BAD_REQUEST, "User already Created");
  }
};
const addUser = async (userData) => {
  if (!userData.phoneNumber || !userData.deviceId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Phone number or deviceId is required"
    );
  }
  try {
    userData.accountStatus = 1; // Ensure new users are active by default
    userData.setDeviceId = true;
    // Upsert the user (update if exists, otherwise create)
    const [user, created] = await User.upsert(userData, { returning: true });

    return user;
  } catch (error) {
    logger.error(
      "Error :: user.service :: createUser :: " + error.stack || error.message
    );
    if (error instanceof Sequelize.UniqueConstraintError) {
      throw new ApiError(
        httpStatus.UNPROCESSABLE_ENTITY,
        "Assignor already exists"
      );
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "User already Created");
    }
  }
};
// Service to get a user by ID
const getUserById = async (userId) => {
  try {
    const user = await User.findOne({
      where: {
        userId,
        accountStatus: 1, // Only fetch active users
      },
      raw: true,
    });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
  } catch (error) {
    logger.error(
      "Error :: user.service :: getUserById :: " + error.stack || error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Service to update a user
const updateUser = async (userId, updatedData) => {
  try {
    const user = await User.findOne({
      where: { userId, accountStatus: 1 }, // Only allow updates for active users
    });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    await user.update(updatedData);
    return user;
  } catch (error) {
    logger.error(
      "Error :: user.service :: updateUser :: " + error.stack || error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Service to delete a user
const deleteUser = async (userId) => {
  try {
    const user = await User.findOne({
      where: { userId, accountStatus: 1 }, // Only delete if user is active
    });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    await user.update({
      accountStatus: 3,
    });
    return { message: "User deleted successfully" };
  } catch (error) {
    logger.error(
      "Error :: user.service :: deleteUser :: " + error.stack || error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Service to get all users (optional)
const getAllUsers = async (filters = {}) => {
  try {
    let whereConditions = { accountStatus: { [Op.ne]: 3 } }; // Exclude deleted users

    if (filters.userId) {
      whereConditions.userId = filters.userId;
    }
    if (filters.phoneNumber) {
      whereConditions.phoneNumber = filters.phoneNumber;
    }
    if (filters.email) {
      whereConditions.email = filters.email;
    }
    if (filters.firstName) {
      whereConditions.firstName = { [Op.like]: `%${filters.firstName}%` };
    }
    if (filters.lastName) {
      whereConditions.lastName = { [Op.like]: `%${filters.lastName}%` };
    }

    // Handle createdAt filtering (exact or range)
    if (filters.startDate && filters.endDate) {
      whereConditions.createdAt = {
        [Op.between]: [new Date(filters.startDate), new Date(filters.endDate)],
      };
    } else if (filters.createdAt) {
      whereConditions.createdAt = {
        [Op.eq]: new Date(filters.createdAt),
      };
    }

    const users = await User.findAll({ where: whereConditions });
    return users;
  } catch (error) {
    logger.error(
      "Error :: user.service :: getUsers :: " + error.stack || error.message
    );
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  loginUser,
  addUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers, // Optional
};

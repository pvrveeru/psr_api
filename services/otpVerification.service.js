const OTPVerification = require("../models/otpVerification"); // Adjust the path as needed
const { status: httpStatus } = require("http-status");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const User = require("../models/user");
const { sql } = require("@sequelize/core");
const createJwtToken = require("../middlewares/createJwtToken");
// Service to create a new OTP entry
const createOTP = async ({ phoneNumber, otpCode, expiresAt }) => {
  try {
    let [otpEntry, created] = await OTPVerification.findOrCreate({
      where: { phoneNumber },
      defaults: {
        otpCode,
        expiresAt,
        otpCount: 1, // Initial count if creating
      },
    });

    if (!created) {
      // Update OTP and increment otpCount
      await OTPVerification.update(
        {
          otpCode,
          expiresAt,
          otpCount: sql.literal(`otp_count + ${1}`), // Increment count
        },
        {
          where: { phoneNumber },
          raw: true,
        }
      );
      // Retrieve the updated record
      otpEntry = await OTPVerification.findOne({
        where: { phoneNumber },
      });
      logger.info("Existing OTP record updated and otpCount incremented.");
    } else {
      logger.info("A new OTP record created with otpCount set to 1.");
    }
    return otpEntry;
  } catch (error) {
    logger.error(
      "Error :: otpVerification.service :: createOTP :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Service to validate an OTP
const validateOTP = async (phoneNumber, otpCode) => {
  try {
    const otpEntry = await OTPVerification.findOne({
      where: {
        phoneNumber,
        otpCode,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!otpEntry) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP or phone number");
    }

    if (otpEntry.expiresAt < new Date()) {
      throw new ApiError(httpStatus.FORBIDDEN, "OTP has expired");
    }
    // OTP is valid, delete it
    await OTPVerification.destroy({ where: { phoneNumber, otpCode } });
    // Update the user record
    const updatedUser = await User.update(
      { accountVerified: true, phoneVerified: true },
      { where: { phoneNumber }, returning: true }
    );

    if (!updatedUser[0]) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    const user = await User.findOne({
      where: {
        phoneNumber,
      },
      raw: true,
    });
    const token = await createJwtToken({
      data: { userId: user.userId, username: user.userName, role: "user" },
      expiresIn: "7d",
    });
    return { ...user, accessToken: token };
  } catch (error) {
    logger.error(
      "Error :: otpVerification.service :: validateOTP :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Service to delete an OTP after successful verification
const deleteOTP = async (otpId) => {
  try {
    const otpEntry = await OTPVerification.findByPk(otpId);
    if (!otpEntry) {
      throw new ApiError(httpStatus.NOT_FOUND, "OTP not found");
    }
    await otpEntry.destroy();
    return { message: "OTP deleted successfully" };
  } catch (error) {
    logger.error(
      "Error :: otpVerification.service :: deleteOTP :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Service to delete all expired OTPs
const deleteExpiredOTPs = async () => {
  try {
    const result = await OTPVerification.destroy({
      where: {
        expiresAt: {
          [Sequelize.Op.lt]: new Date(), // Delete where expiresAt is less than the current time
        },
      },
    });
    return { message: `${result} expired OTP(s) deleted` };
  } catch (error) {
    logger.error(
      "Error :: otpVerification.service :: deleteExpiredOTPs :: " +
        error.stack || error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

module.exports = {
  createOTP,
  validateOTP,
  deleteOTP,
  deleteExpiredOTPs,
};

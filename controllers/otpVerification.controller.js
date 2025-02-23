const otpService = require("../services/otpVerification.service"); // Adjust the path as needed
const { validationResult } = require("express-validator");
const logger = require("../config/logger");
const { status: httpStatus } = require("http-status");
const handleCatch = require("../utils/handleCatch");

// Create OTP
const createOtp = async (req, res) => {
  // Validate the request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const data = req.body;

    // Call the OTP service to create an OTP
    const otpDetails = await otpService.createOTP(data);

    // Return success response
    res.status(httpStatus.CREATED).json({
      status: "success",
      message: "OTP created successfully",
      data: otpDetails,
    });
  } catch (error) {
    handleCatch(res, error, "Error creating OTP: ");
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  // Validate the request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { phoneNumber, otpCode } = req.body;

    // Call the OTP service to verify OTP
    const isOtpValid = await otpService.validateOTP(phoneNumber, otpCode);

    if (!isOtpValid) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        message: "Invalid OTP or OTP expired",
      });
    }

    // Return success response
    res.status(httpStatus.OK).json({
      status: "success",
      message: "OTP verified successfully",
      data: isOtpValid,
    });
  } catch (error) {
    handleCatch(res, error, "Error verifying OTP: ");
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  // Validate the request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { phoneNumber } = req.body;

    // Call the OTP service to resend OTP
    const otpDetails = await otpService.resendOtp(phoneNumber);

    // Return success response
    res.status(httpStatus.OK).json({
      status: "success",
      message: "OTP resent successfully",
      data: otpDetails,
    });
  } catch (error) {
    handleCatch(res, error, "Error resending OTP: ");
  }
};

// Get OTP by ID (Optional)
const getOtpById = async (req, res) => {
  try {
    const { id } = req.params;

    // Call the OTP service to fetch OTP by ID
    const otp = await otpService.getOtpById(id);

    // Return success response
    res.status(httpStatus.OK).json({
      status: "success",
      message: "OTP fetched successfully",
      data: otp,
    });
  } catch (error) {
    handleCatch(res, error, "Error fetching OTP by ID: ");
  }
};

// Delete OTP (Optional)
const deleteOtp = async (req, res) => {
  try {
    const { id } = req.params;

    // Call the OTP service to delete OTP
    await otpService.deleteOTP(id);

    // Return success response
    res.status(httpStatus.NO_CONTENT).json({
      status: "success",
      message: "OTP deleted successfully",
      data: null,
    });
  } catch (error) {
    handleCatch(res, error, "Error deleting OTP:");
  }
};

module.exports = {
  createOtp,
  verifyOtp,
  resendOtp,
  getOtpById,
  deleteOtp,
};

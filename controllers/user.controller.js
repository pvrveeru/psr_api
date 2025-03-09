const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const logger = require("../config/logger");
const { status: httpStatus } = require("http-status");
const handleCatch = require("../utils/handleCatch");
const otpGenerator = require("otp-generator");
// Create item with validation
const loginUser = async (req, res) => {
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
    const {
      firstName,
      lastName,
      userName,
      description,
      phoneNumber,
      email,
      gender,
      dateOfBirth,
      country,
      notificationsEnabled,
      darkModeEnabled,
      createdAt,
      password,
    } = req.body;
    let obj = {
      firstName,
      lastName,
      userName,
      description,
      phoneNumber,
      email,
      gender,
      dateOfBirth,
      country,
      notificationsEnabled,
      darkModeEnabled,
      createdAt,
      password,
    };
    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    // Create the item using the service
    const item = await userService.loginUser(req.body, otp);

    // Return a standardized response
    res.status(httpStatus.CREATED).json({
      status: "success",
      message: "OTP sent to your registered phone number",
      data: item,
    });
  } catch (error) {
    handleCatch(res, error, "Error creating user : ");
  }
};
const addUser = async (req, res) => {
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
    const {
      firstName,
      lastName,
      userName,
      description,
      phoneNumber,
      email,
      gender,
      dateOfBirth,
      country,
      notificationsEnabled,
      darkModeEnabled,
      createdAt,
      password,
    } = req.body;
    let obj = {
      firstName,
      lastName,
      userName,
      description,
      phoneNumber,
      email,
      gender,
      dateOfBirth,
      country,
      notificationsEnabled,
      darkModeEnabled,
      createdAt,
      password,
    };

    // Create the item using the service
    const item = await userService.addUser(req.body);

    // Return a standardized response
    res.status(httpStatus.CREATED).json({
      status: "success",
      message: "User Added successfully",
      data: item,
    });
  } catch (error) {
    handleCatch(res, error, "Error creating user : ");
  }
};

// Get all items
const getAllUsers = async (req, res) => {
  let filters = req.query;
  try {
    const items = await userService.getAllUsers(filters);
    res.status(httpStatus.OK).json({
      status: "success",
      message: "Users fetched successfully",
      data: items,
    });
  } catch (error) {
    handleCatch(res, error, "Error fetching users: ");
  }
};

// Get item by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await userService.getUserById(id);
    res.status(httpStatus.OK).json({
      status: "success",
      message: "Item fetched successfully",
      data: item,
    });
  } catch (error) {
    handleCatch(res, error, "Error fetching user by ID: ");
  }
};

// Update item
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const item = await userService.updateUser(id, req.body);
    res.status(httpStatus.OK).json({
      status: "success",
      message: "Item updated successfully",
      data: item,
    });
  } catch (error) {
    handleCatch(res, error, "Error updating user: ");
  }
};

// Delete item
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(httpStatus.NO_CONTENT).json({
      status: "success",
      message: "Item deleted successfully",
      data: null,
    });
  } catch (error) {
    handleCatch(res, error, "Error deleting user : ");
  }
};

module.exports = {
  addUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
};

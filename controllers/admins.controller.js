const { validationResult } = require("express-validator");
const adminService = require("../services/admins.service");
const logger = require("../config/logger");
const bcrypt = require("bcrypt");
const { status: httpStatus } = require("http-status");
const handleCatch = require("../utils/handleCatch");

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "Username and password are required." });
    }

    // Authenticate admin
    const tokenData = await adminService.authenticateAdmin(username, password);

    // Send response
    res.status(httpStatus.OK).json({
      status: "success",
      message: "LogIn success",
      data: tokenData,
    });
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).json({ error: error.message });
    }
    handleCatch(res, error, "Error log in admin: ");
  }
};

// Create a new admin
const createAdmin = async (req, res) => {
  // Validate the request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  /**
   * Authenticate an admin and return a JWT token.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */

  try {
    const { username, password } = req.body;
    const saltRounds = 10; // Number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const adminData = { username, password: hashedPassword };
    const admin = await adminService.createAdmin(adminData);

    res.status(httpStatus.CREATED).json({
      status: "success",
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    handleCatch(res, error, "Error creating admin: ");
  }
};

// Get admin by ID
const getAdminById = async (req, res) => {
  try {
    const { id: adminId } = req.params;

    const admin = await adminService.getAdminById(adminId);

    res.status(httpStatus.OK).json({
      status: "success",
      message: "Admin fetched successfully",
      data: admin,
    });
  } catch (error) {
    handleCatch(res, error, "Error fetching admin: ");
  }
};

// Update admin by ID
const updateAdmin = async (req, res) => {
  try {
    const { id: adminId } = req.params;
    const updatedData = req.body;

    const admin = await adminService.updateAdmin(adminId, updatedData);

    res.status(httpStatus.OK).json({
      status: "success",
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (error) {
    handleCatch(res, error, "Error updating admin: ");
  }
};

// Delete admin by ID
const deleteAdmin = async (req, res) => {
  try {
    const { id: adminId } = req.params;

    const result = await adminService.deleteAdmin(adminId);

    res.status(httpStatus.NO_CONTENT).json({
      status: "success",
      message: result.message,
      data: null,
    });
  } catch (error) {
    handleCatch(res, error, "Error deleting admin: ");
  }
};

// Get all admins (optional, with filtering support)
const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminService.getAllAdmins();

    res.status(httpStatus.OK).json({
      status: "success",
      message: "All admins fetched successfully",
      data: admins,
    });
  } catch (error) {
    handleCatch(res, error, "Error fetching all admins:  ");
  }
};
// Get all SummaryData (optional, with filtering support)
const getSummaryData = async (req, res) => {
  const { eventType, eventName, eventDate, eventId } = req.query;
  try {
    const admins = await adminService.getSummaryData({
      eventType,
      eventName,
      eventDate,
      eventId,
    });

    res.status(httpStatus.OK).json({
      status: "success",
      message: "SummaryData fetched successfully",
      data: admins,
    });
  } catch (error) {
    handleCatch(res, error, "Error fetching SummaryData:  ");
  }
};

module.exports = {
  loginAdmin,
  createAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAllAdmins, // Optional
  getSummaryData,
};

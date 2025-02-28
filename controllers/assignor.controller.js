const { validationResult } = require("express-validator");
const assignorService = require("../services/assignor.service");
const logger = require("../config/logger");
const { status: httpStatus } = require("http-status");
const handleCatch = require("../utils/handleCatch");

// Create Event Category
const addAssignor = async (req, res) => {
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
    const { assignor } = req.body;

    const category = await assignorService.addAssignor({
      assignor,
    });

    res.status(httpStatus.CREATED).json({
      status: "success",
      message: "Assignor Added successfully",
      data: category,
    });
  } catch (error) {
    handleCatch(res, error, "Error Adding Assignor: ");
  }
};

// Get Event Category by ID
const getAssignorById = async (req, res) => {
  try {
    const { assignorId } = req.params;

    const category = await assignorService.getAssignorById(assignorId);

    res.status(httpStatus.OK).json({
      status: "success",
      message: "Assignor fetched successfully",
      data: category,
    });
  } catch (error) {
    handleCatch(res, error, "Error fetching Assignor: ");
  }
};

// Update Event Category
const updateAssignor = async (req, res) => {
  try {
    const { assignorId } = req.params;
    const updatedData = req.body;

    const category = await assignorService.updateAssignor(
      assignorId,
      updatedData
    );

    res.status(httpStatus.OK).json({
      status: "success",
      message: "Assignor updated successfully",
      data: category,
    });
  } catch (error) {
    handleCatch(res, error, "Error updating Assignor: ");
  }
};

// Delete Event Category
const deleteAssignor = async (req, res) => {
  try {
    const { assignorId } = req.params;

    const result = await assignorService.deleteAssignor(assignorId);

    res.status(204).json({
      status: "success",
      message: result.message,
      data: null,
    });
  } catch (error) {
    handleCatch(res, error, "Error deleting Assignor: ");
  }
};

// Get All Event Categories
const getAllAssignors = async (req, res) => {
  try {
    const categories = await assignorService.getAllAssignors();

    res.status(httpStatus.OK).json({
      status: "success",
      message: "All Assignors fetched successfully",
      data: categories,
    });
  } catch (error) {
    handleCatch(res, error, "Error fetching all Assignors: ");
  }
};

module.exports = {
  addAssignor,
  getAssignorById,
  updateAssignor,
  deleteAssignor,
  getAllAssignors,
};

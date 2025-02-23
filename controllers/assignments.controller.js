const { validationResult } = require("express-validator");
const assignmentsService = require("../services/assignments.service");
const logger = require("../config/logger");
const { status: httpStatus } = require("http-status");
const handleCatch = require("../utils/handleCatch");

const addAssignment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const item = await assignmentsService.addAssignment(req.body);

    res.status(httpStatus.CREATED).json({
      status: "success",
      message: "Assignment submitted successfully",
      data: item,
    });
  } catch (error) {
    handleCatch(res, error, "Error creating Assignment : ");
  }
};

// Get all items
const getAllAssignments = async (req, res) => {
  let filters = req.query;
  try {
    const items = await assignmentsService.getAllAssignments(filters);
    res.status(httpStatus.OK).json({
      status: "success",
      message: "Assignments fetched successfully",
      data: items,
    });
  } catch (error) {
    handleCatch(res, error, "Error fetching Assignments: ");
  }
};

// Get item by ID
const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await assignmentsService.getAssignmentById(id);
    res.status(httpStatus.OK).json({
      status: "success",
      message: "Assignment fetched successfully",
      data: item,
    });
  } catch (error) {
    handleCatch(res, error, "Error fetching Assignment by ID: ");
  }
};

// Update item
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await assignmentsService.updateAssignment(id, req.body);
    res.status(httpStatus.OK).json({
      status: "success",
      message: "Item updated successfully",
      data: item,
    });
  } catch (error) {
    handleCatch(res, error, "Error updating Assignment: ");
  }
};

// Delete item
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    await assignmentsService.deleteAssignment(id);
    res.status(httpStatus.NO_CONTENT).json({
      status: "success",
      message: "Item deleted successfully",
      data: null,
    });
  } catch (error) {
    handleCatch(res, error, "Error deleting Assignment : ");
  }
};

module.exports = {
  addAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentById,
  getAllAssignments,
};

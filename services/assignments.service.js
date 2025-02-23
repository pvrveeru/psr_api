const AssignmentsModel = require("../models/assignments"); // Adjust the path as needed
const { status: httpStatus } = require("http-status");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const { Op, sql } = require("@sequelize/core");

const addAssignment = async (data) => {
  try {
    const resp = await AssignmentsModel.create(data);

    return resp;
  } catch (error) {
    logger.error(
      "Error :: assignments.service :: addAssignment :: " + error.stack ||
        error.message
    );
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "AssignmentsModel already Submitted"
    );
  }
};

const getAssignmentById = async (assignmentId) => {
  try {
    const resp = await AssignmentsModel.findOne({
      where: {
        assignmentId,
      },
      raw: true,
    });
    if (!resp) {
      throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
    }
    return resp;
  } catch (error) {
    logger.error(
      "Error :: assignments.service :: getAssignmentById :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Service to update a user
const updateAssignment = async (assignmentId, updatedData) => {
  try {
    const assignment = await AssignmentsModel.findOne({
      where: { assignmentId }, // Only allow updates for active users
    });
    if (!assignment) {
      throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
    }
    let updatedDataResp = await assignment.update(updatedData);
    return updatedDataResp;
  } catch (error) {
    logger.error(
      "Error :: assignments.service :: updateAssignment :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

const deleteAssignment = async (assignmentId) => {
  try {
    const assignment = await AssignmentsModel.findOne({
      where: { assignmentId },
    });
    if (!assignment) {
      throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
    }

    return { message: "Assignment deleted successfully" };
  } catch (error) {
    logger.error(
      "Error :: assignments.service :: deleteAssignment :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

const getAllAssignments = async (filters = {}) => {
  try {
    let whereConditions = {};

    if (filters.assignmentId) {
      whereConditions.assignmentId = filters.assignmentId;
    }

    if (filters.siteId) {
      whereConditions.siteId = { [Op.iLike]: `%${filters.siteId}%` };
    }
    if (filters.clientName) {
      whereConditions.clientName = { [Op.iLike]: `%${filters.clientName}%` };
    }
    if (filters.name) {
      whereConditions.name = { [Op.iLike]: `%${filters.name}%` };
    }
    if (filters.activity) {
      whereConditions.activity = { [Op.iLike]: `%${filters.activity}%` };
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

    const assignments = await AssignmentsModel.findAll({
      where: whereConditions,
    });
    return assignments;
  } catch (error) {
    logger.error(
      "Error :: assignments.service :: getUsers :: " + error.stack ||
        error.message
    );
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  addAssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getAllAssignments, // Optional
};

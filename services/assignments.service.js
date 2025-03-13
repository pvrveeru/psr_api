const AssignmentsModel = require("../models/assignments"); // Adjust the path as needed
const { status: httpStatus } = require("http-status");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const { Op, sql } = require("@sequelize/core");
const AssignmentGallery = require("../models/assignmentGallery");
const Assignor = require("../models/assignor");
const User = require("../models/user");

const addAssignment = async (data) => {
  try {
    const resp = await AssignmentsModel.create(data);

    return resp;
  } catch (error) {
    logger.error(
      "Error :: assignments.service :: addAssignment :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error?.message);
    }
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
      whereConditions.assignmentId = parseInt(filters.assignmentId);
    }
    if (filters.userId) {
      whereConditions.userId = parseInt(filters.userId);
    }
    if (filters.assignedBy) {
      whereConditions.assignedBy = parseInt(filters.assignedBy);
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
        [Op.between]: [
          new Date(filters.startDate + "T00:00:00.000Z"),
          new Date(filters.endDate + "T23:59:59.999Z"),
        ],
      };
    } else if (filters.createdAt) {
      whereConditions.createdAt = {
        [Op.eq]: new Date(filters.createdAt),
      };
    }
    const limit = filters.limit ? parseInt(filters.limit, 10) : 10;
    const offset = filters.offset ? parseInt(filters.offset, 10) : 0;
    // Sorting
    const sortBy = filters.sortBy || "createdAt";
    const sortOrder = filters.sortOrder === "desc" ? "DESC" : "ASC";

    const totalCount = await AssignmentsModel.count({ where: whereConditions });
    const assignments = await AssignmentsModel.findAll({
      limit,
      offset,
      where: whereConditions,
      order: [[sortBy, sortOrder.toUpperCase()]],
      raw: true,
    });
    const assignmentIds = await assignments.map(
      (assignment) => assignment.assignmentId
    );
    const assignorIds = assignments.map((assignment) => assignment.assignedBy);
    const userIds = assignments.map((assignment) => assignment.userId);
    const assignors = await Assignor.findAll({
      where: { assignorId: assignorIds },
      attributes: ["assignorId", "assignor"],
      raw: true,
    });
    const users = await User.findAll({
      where: { userId: userIds },
      attributes: [
        "userName",
        "phoneNumber",
        "userId",
        "emailId",
        "profileImageUrl",
        "deviceId",
        "address",
      ],
      raw: true,
    });
    console.log(users);
    const images = await AssignmentGallery.findAll({
      where: { assignmentId: assignmentIds },
      attributes: ["assignmentId", "imageUrl"],
      raw: true,
    });
    const galleryMap = await images.reduce((acc, image) => {
      if (!acc[image.assignmentId]) acc[image.assignmentId] = [];
      acc[image.assignmentId].push(image.imageUrl);
      return acc;
    }, {});
    const userMap = await users.reduce((acc, user) => {
      acc[user.userId] = user;
      return acc;
    }, {});
    const assignorMap = assignors.reduce((acc, assignor) => {
      acc[assignor.assignorId] = assignor;
      return acc;
    }, {});
    console.log(userMap);
    const result = assignments.map((assignment) => ({
      ...assignment,
      galleryImages: galleryMap[assignment.assignmentId] || [],
      assignedBy: assignorMap[assignment.assignedBy],
      userId: userMap[assignment.userId],
    }));

    return { result, totalNoOfRecords: totalCount };
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

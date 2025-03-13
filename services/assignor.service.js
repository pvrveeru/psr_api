const AssignorModel = require("../models/assignor"); // Adjust the path as needed
const AssignmentModel = require("../models/assignments"); // Adjust the path as needed
const { status: httpStatus } = require("http-status");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const { Sequelize } = require("@sequelize/core");

const addAssignor = async (assignorData) => {
  try {
    const resp = await AssignorModel.create(assignorData);
    return resp;
  } catch (error) {
    logger.error(
      "Error :: assignor.service :: addAssignor :: " + error.stack ||
        error.message
    );
    if (error instanceof Sequelize.UniqueConstraintError) {
      throw new ApiError(
        httpStatus.UNPROCESSABLE_ENTITY,
        "Assignor already exists"
      );
    } else {
      if (error.statusCode) {
        throw error;
      } else {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
    }
  }
};

const getAssignorById = async (assignorId) => {
  try {
    const resp = await AssignorModel.findByPk(assignorId);
    if (!resp) {
      throw new ApiError(httpStatus.NOT_FOUND, "Assignor not found");
    }
    return resp;
  } catch (error) {
    logger.error(
      "Error :: assignor.service :: getAssignorById :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

const updateAssignor = async (assignorId, updatedData) => {
  try {
    const assignor = await AssignorModel.findByPk(assignorId);
    if (!assignor) {
      throw new ApiError(httpStatus.NOT_FOUND, "Assignor not found");
    }
    await assignor.update(updatedData);
    return assignor;
  } catch (error) {
    logger.error(
      "Error :: assignor.service :: updateAssignor :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

const deleteAssignor = async (assignorId) => {
  try {
    const assignor = await AssignorModel.findByPk(assignorId);
    if (!assignor) {
      throw new ApiError(httpStatus.NOT_FOUND, "Assignor not found");
    }

    // Check for related assignments
    const assignmentsCount = await AssignmentModel.count({
      where: { assigned_by: assignorId },
    });

    if (assignmentsCount > 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Cannot delete assignor: Related assignments exist"
      );
    }

    await assignor.destroy();
    return { message: "Assignor deleted successfully" };
  } catch (error) {
    logger.error(
      "Error :: assignor.service :: deleteAssignor :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Cannot delete assignor: Related assignments exist"
      );
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Service to get all event categories
const getAllAssignors = async () => {
  try {
    const totalNoOfRecords = await AssignorModel.count();
    const Assignors = await AssignorModel.findAll();
    return { Assignors, totalNoOfRecords };
  } catch (error) {
    logger.error(
      "Error :: assignor.service :: getAllAssignors :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

module.exports = {
  addAssignor,
  getAssignorById,
  updateAssignor,
  deleteAssignor,
  getAllAssignors,
};

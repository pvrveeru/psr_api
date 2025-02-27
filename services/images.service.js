const { status: httpStatus } = require("http-status");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const User = require("../models/user");
const AssignmentModel = require("../models/assignments");
const { s3 } = require("../config/s3");
const fs = require("fs");
require("dotenv").config();

// Service function to delete file from DigitalOcean Spaces
const deleteFile = async ({ filePath, user_Id, assignmentId, fileName }) => {
  try {
    const user = await User.findByPk(user_Id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    const assignment = await AssignmentModel.findByPk(assignmentId);
    if (!assignment) {
      throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
    }

    const params = {
      Bucket: process.env.DO_SPACES_NAME,
      Key: filePath, // Full path to the file in DigitalOcean Spaces
    };

    const result = await s3.deleteObject(params).promise();
    await assignment.update({ imageUrl: "" });

    if (Object.keys(result).length === 0) {
      logger.info("File deleted successfully");
      return true;
    } else {
      logger.info("Unexpected response:", result);
      return false;
    }
  } catch (error) {
    if (error.statusCode) {
      throw error;
    } else if (error.code === "NoSuchKey") {
      throw new ApiError(httpStatus.NOT_FOUND, "File not found");
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

const getFile = async ({ path }) => {
  try {
    let folderPath = path;

    const params = {
      Bucket: process.env.DO_SPACES_NAME,
      Prefix: folderPath,
    };

    const data = await s3.listObjectsV2(params).promise();

    if (!data.Contents.length) {
      throw new ApiError(httpStatus.NOT_FOUND, "No file found.");
    }

    const baseUrl = `https://${process.env.DO_SPACES_NAME}.${process.env.DO_SPACES_ENDPOINT}`;
    return data.Contents.map((file) => `${baseUrl}/${file.Key}`);
    // console.log(data.Contents);
    // return data.Contents;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};
const uploadFile = async ({ file, folder, assignmentId, user_id }) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }
    const user = await User.findByPk(user_id);

    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "You are not authorized to update this profile image"
      );
    }
    const assignment = await AssignmentModel.findByPk(assignmentId);
    if (!assignment) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Assignment not found with the provided ID"
      );
    }
    const fileContent = fs.readFileSync(file.path);
    const uploadPath = `${folder}`;

    const params = {
      Bucket: process.env.DO_SPACES_NAME,
      Key: uploadPath,
      Body: fileContent,
      ACL: "public-read",
      ContentType: file.mimetype, // Automatically detect the file type
    };

    // Upload file to DigitalOcean Spaces
    const data = await s3.upload(params).promise();

    let updatedData;
    updatedData = { imageUrl: data.Location };
    await assignment.update(updatedData);
    // Delete local file after successful upload
    try {
      fs.unlinkSync(file.path);
    } catch (error) {
      logger.error("Error deleting file from temp folder: ", error.message);
    }

    return data.Location; // Return file URL
  } catch (error) {
    // Attempt to delete the local file in case of an error
    try {
      fs.unlinkSync(file.path);
    } catch (deleteError) {
      logger.error(
        "Error deleting file from temp folder: ",
        deleteError.message
      );
    }

    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

module.exports = { deleteFile, getFile, uploadFile };

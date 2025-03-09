const { status: httpStatus } = require("http-status");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const User = require("../models/user");
const AssignmentModel = require("../models/assignments");
const AssignmentGallery = require("../models/assignmentGallery");
const { s3 } = require("../config/s3");
const fs = require("fs");
const { addAssignmentImages } = require("./assignmentImages.service");
require("dotenv").config();
const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const {
  paginateListObjectsV2,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
// Service function to delete file from DigitalOcean Spaces
const deleteFile = async ({ filePath, user_Id, assignmentId, fileName }) => {
  try {
    // const user = await User.findByPk(user_Id);
    // if (!user) {
    //   throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    // }
    const assignment = await AssignmentModel.findByPk(assignmentId);
    if (!assignment) {
      throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filePath, // Full path to the file in DigitalOcean Spaces
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    // Delete from DB
    await AssignmentGallery.destroy({
      where: {
        imageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`,
      },
    });

    logger.info("✅ File deleted successfully");
    return true;
  } catch (error) {
    logger.error("❌ Delete File Error:", error.message);
    if (error.name === "NoSuchKey") {
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
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: folderPath,
    };

    // const data = await s3.listObjectsV2(params).promise();
    const command = new ListObjectsV2Command(params);
    const data = await s3.send(command);

    if (!data.Contents || data.Contents.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, "No files found.");
    }

    const baseUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
    return data.Contents.map((file) => `${baseUrl}/${file.Key}`);
  } catch (error) {
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};
const getAllFiles = async ({ path }) => {
  try {
    const paginatorConfig = {
      client: s3,
      pageSize: 1000,
      startingToken: undefined,
    };

    const commandParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: path,
    };

    const paginator = paginateListObjectsV2(paginatorConfig, commandParams);

    const baseUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
    const fileUrls = [];

    for await (const page of paginator) {
      if (page.Contents) {
        const urls = page.Contents.map((file) => `${baseUrl}/${file.Key}`);
        fileUrls.push(...urls);
      }
    }

    if (fileUrls.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, "No files found.");
    }

    return fileUrls;
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
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uploadPath,
      Body: fileContent,
      ACL: "public-read",
      ContentType: file.mimetype, // Automatically detect the file type
    };

    // Upload file to DigitalOcean Spaces
    const command = new PutObjectCommand(params);
    await s3.send(command);

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

const uploadFiles = async ({ files, path, assignmentId }) => {
  try {
    if (!files || files.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No files provided");
    }

    const currentImageCount = await AssignmentGallery.count({
      where: { assignmentId },
    });

    if (currentImageCount + files.length > 5) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You can only upload a total of 5 images to the assignment gallery."
      );
    }

    const uploadedUrls = files.map((file) => {
      // Construct the file URL based on your S3 configuration
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`;
      return fileUrl;
    });

    await addAssignmentImages({ imageUrls: uploadedUrls, assignmentId });

    return uploadedUrls;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};
module.exports = { deleteFile, getFile, uploadFile, uploadFiles, getAllFiles };

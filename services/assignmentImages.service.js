const AssignmentGallery = require("../models/assignmentGallery"); // Adjust the path as needed
const { status: httpStatus } = require("http-status");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
// Service to add a new banner images
const addAssignmentImages = async ({ imageUrls, assignmentId }) => {
  try {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No images provided");
    }

    // Prepare gallery entries
    const images = imageUrls.map((imageUrl) => ({
      assignmentId,
      imageUrl,
    }));

    // Insert multiple images into the database
    const response = await AssignmentGallery.bulkCreate(images);

    return response;
  } catch (error) {
    logger.error(
      "Error :: bannerImages.service :: addAssignmentImages :: " +
        error.stack || error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Service to get all images for a specific event
const getAssignmentImages = async (assignmentId) => {
  try {
    const totalNoOfRecords = await AssignmentGallery.count({ assignmentId });
    const images = await AssignmentGallery.findAll({ where: { assignmentId } });
    if (images.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, "No Assignment images");
    }
    return {
      images,
      totalNoOfRecords, // Include total count of banner images
    };
  } catch (error) {
    logger.error(
      "Error :: bannerImages.service :: getAssignmentImages :: " +
        error.stack || error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Service to delete a specific image by its gallery ID
const deleteAssignmentImage = async (assignmentId) => {
  try {
    const image = await AssignmentGallery.findByPk(assignmentId);
    if (!image) {
      throw new ApiError(httpStatus.NOT_FOUND, "Image not found");
    }
    await image.destroy();
    return { message: "Image deleted successfully" };
  } catch (error) {
    logger.error(
      "Error :: bannerImages.service :: deleteAssignmentImage :: " +
        error.stack || error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Service to delete all images for a specific event
// const deleteImagesByEventId = async (eventId) => {
//   try {
//     await EventGallery.destroy({ where: { eventId } });
//     return { message: "All images for the event deleted successfully" };
//   } catch (error) {
//     logger.error(
//       "Error :: bannerImages.service :: deleteImagesByEventId :: " +
//         error.stack || error.message
//     );
//     if (error.statusCode) {
//       throw error;
//     } else {
//       throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
//     }
//   }
// };

module.exports = {
  addAssignmentImages,
  getAssignmentImages,
  deleteAssignmentImage,
};

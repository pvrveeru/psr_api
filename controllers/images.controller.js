const {
  deleteFile,
  getFile,
  uploadFile,
  uploadFiles,
} = require("../services/images.service");
const { status: httpStatus } = require("http-status");
const handleCatch = require("../utils/handleCatch");

const getImage = async (req, res) => {
  try {
    const { assignmentId } = req.params; // Extract event ID from URL
    const images = await getFile({
      path: `assignments/images/${assignmentId}`,
    });

    res.status(httpStatus.OK).json({
      message: "Images fetched successfully",
      images,
    });
  } catch (error) {
    handleCatch(res, error, "Error fetching images: ");
  }
};

const uploadImage = async (req, res) => {
  try {
    const { assignmentId } = req.params; // Event ID from URL
    const file = req.file;
    const user_id = req?.user?.userId;
    if (!file) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "No files uploaded" });
    }
    // Upload image to DigitalOcean Spaces inside eventId folder
    const fileUrl = await uploadFile({
      file,
      folder: "assignments/images" + assignmentId,
      user_id,
      assignmentId,
    });

    res
      .status(httpStatus.OK)
      .json({ message: "File uploaded successfully", urls: fileUrl });
  } catch (error) {
    handleCatch(res, error, "Error fetching images: ");
  }
};

const deleteImage = async (req, res) => {
  try {
    const { assignmentId, fileName } = req.params;
    const user_Id = req?.user?.userId;
    const filePath = `assignments/images/${assignmentId}/${fileName}`;

    const deleted = await deleteFile({
      filePath,
      assignmentId,
      fileName,
      user_Id,
    });
    if (deleted) {
      res.status(httpStatus.OK).json({ message: "File deleted successfully" });
    } else {
      res.status(httpStatus.NOT_FOUND).json({ error: "File not found" });
    }
  } catch (error) {
    handleCatch(res, error, "Error deleting images: ");
  }
};
const uploadImages = async (req, res) => {
  try {
    const { assignmentId } = req.params; // Event ID from URL
    const files = req.files;

    if (!files || files.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "No files uploaded" });
    }
    // Upload image to DigitalOcean Spaces inside eventId folder
    const fileUrls = await uploadFiles({
      files,
      path: "assignments/images/" + assignmentId,
      assignmentId,
    });

    res
      .status(httpStatus.OK)
      .json({ message: "File uploaded successfully", urls: fileUrls });
  } catch (error) {
    handleCatch(res, error, "Error uploading images: ");
  }
};
module.exports = {
  deleteImage,
  uploadImage,
  uploadImages,
  getImage,
};

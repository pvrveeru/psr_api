const express = require("express");
const { check } = require("express-validator");
const { upload } = require("../../middlewares/upload");
const { checkUserExist } = require("../../services/checks/checkUserExist");
const { validation } = require("../../middlewares/validation");
const {
  getImage,
  uploadImage,
  deleteImage,
} = require("../../controllers/images.controller");
const { authenticateUser } = require("../../middlewares/authMiddleware");
const { roleCheck } = require("../../middlewares/roleCheck");
const router = express.Router();

router.get(
  "/assignment/:assignment",
  [
    check("assignment")
      .trim()
      .isInt()
      .withMessage("Invalid assignment. Must be an integer."),
  ],
  validation,
  authenticateUser,
  checkUserExist,
  getImage
);

router.post(
  "/assignment/:assignment",
  [
    check("assignment")
      .trim()
      .isInt()
      .withMessage("Invalid assignment. Must be an integer."),
  ],
  validation,
  authenticateUser,
  checkUserExist,
  upload.single("image"),
  uploadImage
);

router.delete("/assignment/:assignment/", authenticateUser, deleteImage);

module.exports = router;
/**
 * @swagger
 * /uploads/assignment/{assignmentId}:
 *   get:
 *     summary: Get image for a specific assignment
 *     description: Get image for a specific assignment
 *     tags:
 *       - Uploads
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique assignment ID
 *     responses:
 *       200:
 *         description: Image fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image fetched successfully"
 *                 image:
 *                   type: string
 *                   example: "https://your_space_name.your_region.digitaloceanspaces.com/assignment123/filename.jpg"
 *       404:
 *         description: Image not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /uploads/assignment/{assignmentId}:
 *   post:
 *     summary: Upload image for a specific assignment
 *     description: Upload image for a specific assignment
 *     tags:
 *       - Uploads
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique assignment ID to store image under
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Files uploaded successfully"
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "https://your_space_name.your_region.digitaloceanspaces.com/event123/filename.jpg"
 *       400:
 *         description: No files uploaded
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /uploads/assignment/{assignmentId}:
 *   delete:
 *     summary: Delete a assignment image
 *     tags:
 *       - Uploads
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique assignment ID
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */

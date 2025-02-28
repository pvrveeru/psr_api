const express = require("express");
const validate = require("../../middlewares/validate");
const assignorController = require("../../controllers/assignor.controller");
const { authenticateUser } = require("../../middlewares/authMiddleware");
const { roleCheck } = require("../../middlewares/roleCheck");

const router = express.Router();

router.get("/", authenticateUser, assignorController.getAllAssignors);
router.get(
  "/:assignorId",
  authenticateUser,
  assignorController.getAssignorById
);
router.post(
  "/",
  authenticateUser,
  roleCheck(["admin"]),
  assignorController.addAssignor
);
router.put(
  "/:assignorId",
  authenticateUser,
  roleCheck(["admin"]),
  assignorController.updateAssignor
);
router.delete(
  "/:assignorId",
  authenticateUser,
  roleCheck(["admin"]),
  assignorController.deleteAssignor
);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Assignors
 *   description: Manage Assignors
 */

/**
 * @swagger
 * /assignor:
 *   get:
 *     summary: Get all Assignors
 *     description: Retrieve a list of all available Assignors
 *     tags: [Assignors]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: false
 *         schema:
 *           type: string
 *           example: "Bearer <your-token>"
 *         description: The authorization token needed to access protected routes.
 *       - in: header
 *         name: Content-Type
 *         required: false
 *         schema:
 *           type: string
 *           example: "application/json"
 *         description: The content type of the request body.
 *       - in: header
 *         name: RequestId
 *         required: false
 *         schema:
 *           type: string
 *           example: "req-12345"
 *         description: A unique identifier for the request (useful for logging).
 *     responses:
 *       "200":
 *         description: List of Assignors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AssignorDetail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /assignor/{assignorId}:
 *   get:
 *     summary: Get assignor by ID
 *     description: Retrieve details of a specific assignor by its ID.
 *     tags: [Assignors]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: false
 *         schema:
 *           type: string
 *           example: "Bearer <your-token>"
 *         description: The authorization token needed to access protected routes.
 *       - in: header
 *         name: Content-Type
 *         required: false
 *         schema:
 *           type: string
 *           example: "application/json"
 *         description: The content type of the request body.
 *       - in: header
 *         name: RequestId
 *         required: false
 *         schema:
 *           type: string
 *           example: "req-12345"
 *         description: A unique identifier for the request (useful for logging).
 *       - in: path
 *         name: assignorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Assignor to retrieve.
 *     responses:
 *       "200":
 *         description: Assignor details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignorDetail'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /assignor:
 *   post:
 *     summary: Create a Assignor
 *     description: Create a new Assignor.
 *     tags: [Assignors]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: false
 *         schema:
 *           type: string
 *           example: "Bearer <your-token>"
 *         description: The authorization token needed to access protected routes.
 *       - in: header
 *         name: Content-Type
 *         required: false
 *         schema:
 *           type: string
 *           example: "application/json"
 *         description: The content type of the request body.
 *       - in: header
 *         name: RequestId
 *         required: false
 *         schema:
 *           type: string
 *           example: "req-12345"
 *         description: A unique identifier for the request (useful for logging).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignor:
 *                 type: string
 *                 description: The name of the assignor.
 *                 example: "John"
 *             required:
 *               - assignor
 *     responses:
 *       "201":
 *         description: Assignor Added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Assignor Added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     assignorId:
 *                       type: integer
 *                       description: The ID of the newly created Assignor.
 *                       example: 1
 *                     assignor:
 *                       type: string
 *                       description: The name of the Assignor.
 *                       example: "john"
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /assignor/{assignorId}:
 *   put:
 *     summary: Update an existing assignor
 *     description: Update the details of an existing assignor
 *     tags: [Assignors]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: false
 *         schema:
 *           type: string
 *           example: "Bearer <your-token>"
 *         description: The authorization token needed to access protected routes.
 *       - in: header
 *         name: Content-Type
 *         required: false
 *         schema:
 *           type: string
 *           example: "application/json"
 *         description: The content type of the request body.
 *       - in: header
 *         name: RequestId
 *         required: false
 *         schema:
 *           type: string
 *           example: "req-12345"
 *         description: A unique identifier for the request (useful for logging).
 *       - in: path
 *         name: assignorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the assignor to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAssignor'
 *     responses:
 *       "200":
 *         description: assignor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignorDetail'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /assignor/{assignorId}:
 *   delete:
 *     summary: Delete an assignor
 *     description: Delete a specific assignor by its ID.
 *     tags: [Assignors]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: false
 *         schema:
 *           type: string
 *           example: "Bearer <your-token>"
 *         description: The authorization token needed to access protected routes.
 *       - in: header
 *         name: Content-Type
 *         required: false
 *         schema:
 *           type: string
 *           example: "application/json"
 *         description: The content type of the request body.
 *       - in: header
 *         name: RequestId
 *         required: false
 *         schema:
 *           type: string
 *           example: "req-12345"
 *         description: A unique identifier for the request (useful for logging).
 *       - in: path
 *         name: assignorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the assignor to delete.
 *     responses:
 *       "200":
 *         description: Assignor deleted successfully
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

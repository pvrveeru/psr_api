const express = require("express");
const validate = require("../../middlewares/validate");
const assignmentsController = require("../../controllers/assignments.controller");
const { authenticateUser } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/",
  //  authenticateUser,
  assignmentsController.getAllAssignments
); // Get all users
router.get(
  "/:id",
  //  authenticateUser,
  assignmentsController.getAssignmentById
); // Get user by ID
router.post("/", assignmentsController.addAssignment); // Create a new user
router.put(
  "/:id",
  //  authenticateUser,
  assignmentsController.updateAssignment
); // Update user by ID
router.delete(
  "/:id",
  // authenticateUser,
  assignmentsController.deleteAssignment
); // Delete user by ID

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Manage Assignments for the application
 */

/**
 * @swagger
 * /assignments:
 *   get:
 *     summary: Get all assignments
 *     description: Retrieve a list of all assignments in the system.
 *     tags: [Assignments]
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
 *       - in: query
 *         name: assignmentId
 *         schema:
 *           type: integer
 *         description: Filter assignments by unique assignment ID.
 *       - in: query
 *         name: assignedBy
 *         schema:
 *           type: integer
 *         description: Filter assignments by assignedBy.
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter assignments by userId.
 *       - in: query
 *         name: siteId
 *         schema:
 *           type: string
 *         description: Filter assignments by siteId.
 *       - in: query
 *         name: clientName
 *         schema:
 *           type: string
 *         description: Filter assignments by clientName.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter assignments by name.
 *       - in: query
 *         name: activity
 *         schema:
 *           type: string
 *         description: Filter assignments by activity.
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter assignments by exact creation date (ISO 8601 format, e.g., 2024-01-18T10:30:00Z).
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for filtering assignments by creation date (ISO 8601 format).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for filtering assignments by creation date (ISO 8601 format).
 *     responses:
 *       "200":
 *         description: List of assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserDetail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     summary: Get assignment by ID
 *     description: Retrieve details of a specific assignment by their ID.
 *     tags: [Assignments]
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
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to retrieve.
 *     responses:
 *       "200":
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDetail'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Create a new assignment
 *     description: Create a new assignment.
 *     tags: [Assignments]
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
 *             $ref: '#/components/schemas/CreateAssignmentRequest'
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   description: The user's unique ID
 *                 phoneNumber:
 *                   type: string
 *                   description: The user's phone number
 *                 userName:
 *                   type: string
 *                   description: The user's display name
 *                 firstName:
 *                   type: string
 *                   description: The user's first name
 *                 lastName:
 *                   type: string
 *                   description: The user's last name
 *                 email:
 *                   type: string
 *                   description: The user's email address
 *                 gender:
 *                   type: string
 *                   description: The user's gender
 *                 dateOfBirth:
 *                   type: string
 *                   format: date
 *                   description: The user's date of birth
 *                 country:
 *                   type: string
 *                   description: The user's country
 *                 notificationsEnabled:
 *                   type: boolean
 *                   description: Whether notifications are enabled for the user
 *                 darkModeEnabled:
 *                   type: boolean
 *                   description: Whether dark mode is enabled for the user
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAssignmentRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Assignment name
 *         clientName:
 *           type: string
 *           description: clientName
 *         siteId:
 *           type: string
 *           description: siteId
 *         activity:
 *           type: string
 *           description: activity
 *         assignedBy:
 *           type: integer
 *           description: assignedBy
 *         remarks:
 *           type: string
 *           description: remarks
 *       example:
 *         name: "+1234567890"
 *         clientName: "john_doe"
 *         siteId: "John"
 *         activity: "Doe"
 *         assignedBy: "john.doe@example.com"
 *         remarks: "male"
 *         latitude: "1990-01-01"
 *         longitude: "USA"
 *         imageUrl: ""
 */
/**
 * @swagger
 * /assignments/{id}:
 *   put:
 *     summary: Update an existing assignment
 *     description: Update the details of an existing assignment.
 *     tags: [Assignments]
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
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the assignment to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       "200":
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDetail'
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
 * /assignments/{id}:
 *   delete:
 *     summary: Delete a assignment
 *     description: Delete a specific assignment by their ID.
 *     tags: [Assignments]
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
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the assignment to delete.
 *     responses:
 *       "200":
 *         description: User deleted successfully
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

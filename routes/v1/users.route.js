const express = require("express");
const validate = require("../../middlewares/validate");
const userController = require("../../controllers/user.controller");
const { authenticateUser } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authenticateUser, userController.getAllUsers); // Get all users
router.get("/:id", authenticateUser, userController.getUserById); // Get user by ID
router.post("/add", userController.addUser); // Create a new user
router.post("/login", userController.loginUser); // Create a new user
router.put("/:id", authenticateUser, userController.updateUser); // Update user by ID
router.delete("/:id", authenticateUser, userController.deleteUser); // Delete user by ID

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: User
 *   description: Manage users for the application
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users in the system.
 *     tags: [User]
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
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter users by unique user ID.
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         description: Filter users by phone number.
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter users by email address.
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: Filter users by first name.
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Filter users by last name.
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter users by exact creation date (ISO 8601 format, e.g., 2024-01-18T10:30:00Z).
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for filtering users by creation date (ISO 8601 format).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for filtering users by creation date (ISO 8601 format).
 *     responses:
 *       "200":
 *         description: List of users
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
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve details of a specific user by their ID.
 *     tags: [User]
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
 * /users/add:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user account.
 *     tags: [User]
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
 *             $ref: '#/components/schemas/CreateUserRequest'
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
 *                 deviceId:
 *                   type: string
 *                   description: device id
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
 * /users/login:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user account.
 *     tags: [User]
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
 *               phoneNumber:
 *                 type: string
 *               deviceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User login successful
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
 *                 deviceId:
 *                   type: string
 *                   description: device id
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
 *     CreateUserRequest:
 *       type: object
 *       properties:
 *         phoneNumber:
 *           type: string
 *           maxLength: 15
 *           description: The user's phone number (required and unique)
 *         userName:
 *           type: string
 *           maxLength: 100
 *           description: The user's display name (required)
 *         firstName:
 *           type: string
 *           maxLength: 100
 *           description: The user's first name (required)
 *         lastName:
 *           type: string
 *           maxLength: 100
 *           description: The user's last name (required)
 *         emailId:
 *           type: string
 *           maxLength: 100
 *           description: The user's email address (required and unique)
 *         gender:
 *           type: string
 *           maxLength: 10
 *           description: The user's gender (optional)
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: The user's date of birth (optional)
 *         deviceId:
 *           type: string
 *           description: deviceId
 *         country:
 *           type: string
 *           maxLength: 100
 *           description: The user's country (optional)
 *         state:
 *           type: string
 *           maxLength: 100
 *           description: The user's state (optional)
 *         city:
 *           type: string
 *           maxLength: 100
 *           description: The user's city (optional)
 *         notificationsEnabled:
 *           type: boolean
 *           description: Whether notifications are enabled for the user (default is true)
 *         darkModeEnabled:
 *           type: boolean
 *           description: Whether dark mode is enabled for the user (default is false)
 *       required:
 *         - phoneNumber
 *       example:
 *         phoneNumber: "+1234567890"
 *         userName: "john_doe"
 *         firstName: "John"
 *         lastName: "Doe"
 *         email: "john.doe@example.com"
 *         gender: "male"
 *         dateOfBirth: "1990-01-01"
 *         country: "USA"
 *         notificationsEnabled: true
 *         darkModeEnabled: false
 *         createdAt: "1990-01-01"
 */
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an existing user
 *     description: Update the details of an existing user.
 *     tags: [User]
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
 *         description: The ID of the user to update.
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
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a specific user by their ID.
 *     tags: [User]
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
 *         description: The ID of the user to delete.
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

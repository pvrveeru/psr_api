const express = require("express");
const validate = require("../../middlewares/validate");
const jwtVerifyToken = require("../../middlewares/jwtVerifyToken");
const adminController = require("../../controllers/admins.controller");
const { roleCheck } = require("../../middlewares/roleCheck");
const { authenticateUser } = require("../../middlewares/authMiddleware");

const router = express.Router();
router.post("/login", adminController.loginAdmin); // Get all users

router.get(
  "/",
  // authenticateUser,
  roleCheck(["admin"]),
  adminController.getAllAdmins
); // Get all admins
// router.get(
//   "/getSummaryData",
//   authenticateUser,
//   roleCheck(["admin"]),
//   adminController.getSummaryData
// ); // Get all admins
router.get(
  "/:id",
  // authenticateUser,
  roleCheck(["admin"]),
  adminController.getAdminById
); // Get admin by ID
// router.post("/", adminController.createAdmin); // Create a new admin
// router.put("/:id", adminController.updateAdmin); // Update an existing admin
// router.delete("/:id", adminController.deleteAdmin); // Delete an admin

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Manage administrators for the application
 */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Get all admins
 *     description: Retrieve a list of all administrators.
 *     tags: [Admin]
 *     parameters:
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
 *         description: List of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminDetail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Get admin by ID
 *     description: Retrieve details of a specific admin by their ID.
 *     tags: [Admin]
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
 *         description: The ID of the admin to retrieve.
 *     responses:
 *       "200":
 *         description: Admin details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminDetail'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Create a new admin
 *     description: Create a new admin account.
 *     tags: [Admin]
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
 *               username:
 *                 type: string
 *                 description: The unique username for the admin.
 *                 example: "admin_user"
 *               password:
 *                 type: string
 *                 description: The hashed password for the admin.
 *                 example: "password_1234"
 *             required:
 *               - username
 *               - password
 *     responses:
 *       "201":
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminDetail'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin Login
 *     description: Allows an admin to log in using their credentials.
 *     tags: [Admin]
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         required: false
 *         schema:
 *           type: string
 *           example: "application/json"
 *         description: The content type of the request.
 *       - in: header
 *         name: RequestId
 *         required: false
 *         schema:
 *           type: string
 *           example: "req-12345"
 *         description: A unique identifier for tracking requests (useful for logging).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The admin's unique username.
 *                 example: "admin_user"
 *               password:
 *                 type: string
 *                 description: The admin's password.
 *                 example: "password_1234"
 *             required:
 *               - username
 *               - password
 *     responses:
 *       "200":
 *         description: Successfully authenticated admin.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminDetail'
 *       "400":
 *         description: Bad request (e.g., missing parameters).
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         description: Unauthorized (invalid credentials).
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden (insufficient permissions).
 *         $ref: '#/components/responses/Forbidden'
 */

// /**
//  * @swagger
//  * /admin/{id}:
//  *   put:
//  *     summary: Update an existing admin
//  *     description: Update the details of an existing admin.
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: header
//  *         name: Authorization
//  *         required: false
//  *         schema:
//  *           type: string
//  *           example: "Bearer <your-token>"
//  *         description: The authorization token needed to access protected routes.
//  *       - in: header
//  *         name: Content-Type
//  *         required: false
//  *         schema:
//  *           type: string
//  *           example: "application/json"
//  *         description: The content type of the request body.
//  *       - in: header
//  *         name: RequestId
//  *         required: false
//  *         schema:
//  *           type: string
//  *           example: "req-12345"
//  *         description: A unique identifier for the request (useful for logging).
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: The ID of the admin to update.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/UpdateAdmin'
//  *     responses:
//  *       "200":
//  *         description: Admin updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/AdminDetail'
//  *       "400":
//  *         $ref: '#/components/responses/BadRequest'
//  *       "404":
//  *         $ref: '#/components/responses/NotFound'
//  *       "401":
//  *         $ref: '#/components/responses/Unauthorized'
//  *       "403":
//  *         $ref: '#/components/responses/Forbidden'
//  */

// /**
//  * @swagger
//  * /admin/{id}:
//  *   delete:
//  *     summary: Delete an admin
//  *     description: Delete a specific admin by their ID.
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: header
//  *         name: Authorization
//  *         required: false
//  *         schema:
//  *           type: string
//  *           example: "Bearer <your-token>"
//  *         description: The authorization token needed to access protected routes.
//  *       - in: header
//  *         name: Content-Type
//  *         required: false
//  *         schema:
//  *           type: string
//  *           example: "application/json"
//  *         description: The content type of the request body.
//  *       - in: header
//  *         name: RequestId
//  *         required: false
//  *         schema:
//  *           type: string
//  *           example: "req-12345"
//  *         description: A unique identifier for the request (useful for logging).
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: The ID of the admin to delete.
//  *     responses:
//  *       "200":
//  *         description: Admin deleted successfully
//  *       "404":
//  *         $ref: '#/components/responses/NotFound'
//  *       "401":
//  *         $ref: '#/components/responses/Unauthorized'
//  *       "403":
//  *         $ref: '#/components/responses/Forbidden'
//  */
// /**
//  * @swagger
//  * /admin/getSummaryData:
//  *   get:
//  *     summary: Get summary data for admins
//  *     description: Retrieve summary information about the admins, such as counts, statuses, or other aggregate data.
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: header
//  *         name: Authorization
//  *         required: false
//  *         schema:
//  *           type: string
//  *           example: "Bearer <your-token>"
//  *         description: The authorization token needed to access protected routes.
//  *       - in: header
//  *         name: Content-Type
//  *         required: false
//  *         schema:
//  *           type: string
//  *           example: "application/json"
//  *         description: The content type of the request body.
//  *       - in: header
//  *         name: RequestId
//  *         required: false
//  *         schema:
//  *           type: string
//  *           example: "req-12345"
//  *         description: A unique identifier for the request (useful for logging).
//  *       - in: query
//  *         name: eventName
//  *         schema:
//  *           type: string
//  *         description: Name of the event.
//  *       - in: query
//  *         name: startDate
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: Filter by a specific event date (YYYY-MM-DD).
//  *       - in: query
//  *         name: endDate
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: Filter by a specific event date (YYYY-MM-DD).
//  *     responses:
//  *       "200":
//  *         description: Summary data retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 totalAdmins:
//  *                   type: integer
//  *                   description: The total number of admins.
//  *                   example: 25
//  *                 activeAdmins:
//  *                   type: integer
//  *                   description: The number of active admins.
//  *                   example: 20
//  *                 inactiveAdmins:
//  *                   type: integer
//  *                   description: The number of inactive admins.
//  *                   example: 5
//  *       "401":
//  *         $ref: '#/components/responses/Unauthorized'
//  *       "403":
//  *         $ref: '#/components/responses/Forbidden'
//  *       "500":
//  *         description: Internal server error
//  */

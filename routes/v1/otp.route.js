const express = require("express");
const validate = require("../../middlewares/validate");
const otpController = require("../../controllers/otpVerification.controller");

const router = express.Router();

// router.post("/", validate(otpValidation.createOTP), otpController.createOtp); // Create OTP
router.post("/validate", otpController.verifyOtp); // Validate OTP
// router.delete("/:id", otpController.deleteOtp); // Delete OTP by ID

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: OTPVerification
 *   description: Manage OTP (One-Time Password) verification
 */

// /**
//  * @swagger
//  * /otp:
//  *   post:
//  *     summary: Create a new OTP
//  *     description: Generate a new OTP for a phone number.
//  *     tags: [OTPVerification]
//  *     parameters:
//  *       - in: header
//  *         name: Authorization
//  *         required: false
//  *         schema:
//  *           type: string
//  *           example: "Bearer <your-token>"
//  *         description: The authorization token needed to access the protected routes.
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
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               phoneNumber:
//  *                 type: string
//  *                 description: Phone number to send OTP
//  *                 example: "1234567890"
//  *     responses:
//  *       "200":
//  *         description: OTP generated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                   example: "success"
//  *                 message:
//  *                   type: string
//  *                   example: "OTP generated successfully"
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     otpId:
//  *                       type: integer
//  *                       description: OTP record ID
//  *                       example: 1
//  *                     phoneNumber:
//  *                       type: string
//  *                       description: The phone number to which OTP is sent
//  *                       example: "1234567890"
//  *                     otpCode:
//  *                       type: string
//  *                       description: The generated OTP code
//  *                       example: "123456"
//  *                     expiresAt:
//  *                       type: string
//  *                       format: date-time
//  *                       description: The expiry timestamp of the OTP
//  *                       example: "2025-01-06T17:50:46.338Z"
//  *       "400":
//  *         $ref: '#/components/responses/BadRequest'
//  *       "401":
//  *         $ref: '#/components/responses/Unauthorized'
//  *       "403":
//  *         $ref: '#/components/responses/Forbidden'
//  */

/**
 * @swagger
 * /otp/validate:
 *   post:
 *     summary: Validate an OTP
 *     description: Validate an OTP code against a phone number.
 *     tags: [OTPVerification]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: false
 *         schema:
 *           type: string
 *           example: "Bearer <your-token>"
 *         description: The authorization token needed to access the protected routes.
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
 *                 description: Phone number to send OTP
 *                 example: "+9191766375824"
 *               otpCode:
 *                 type: string
 *                 description: otpCode
 *                 example: "123456"
 *     responses:
 *       "200":
 *         description: OTP validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OTPValidationResult'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

// /**
//  * @swagger
//  * /otp/{id}:
//  *   delete:
//  *     summary: Delete OTP by ID
//  *     description: Delete an OTP record by its ID.
//  *     tags: [OTPVerification]
//  *     parameters:
//  *       - in: header
//  *         name: Authorization
//  *         required: false
//  *         schema:
//  *           type: string
//  *           example: "Bearer <your-token>"
//  *         description: The authorization token needed to access the protected routes.
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
//  *         description: OTP ID
//  *     responses:
//  *       "200":
//  *         description: OTP deleted successfully
//  *       "404":
//  *         $ref: '#/components/responses/NotFound'
//  *       "401":
//  *         $ref: '#/components/responses/Unauthorized'
//  *       "403":
//  *         $ref: '#/components/responses/Forbidden'
//  */

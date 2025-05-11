const express = require("express");
const router = express.Router();

const vaccineDriveController = require("../controllers/VaccineDriveController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /drives:
 *   post:
 *     summary: Creates Vaccination drive.
 *     description: Creates The vaccination drive in the database.
 *     tags: [Vaccination Drive APIS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: unique id for the drive
 *                 example: 399c557d-5f50-42b5-9a48-cc05091e0e12
 *               vaccineName:
 *                 type: string
 *                 description: Name for the vaciccation 
 *                 example: COVI-SHILD
 *               date:
 *                 type: date
 *                 description: Date for the vaccination drive
 *                 example: 2025-04-20
 *               avilableDoses:
 *                 type: number
 *                 description: Number of avilable doses
 *                 example: 500
 *               grades:
 *                 type: string
 *                 description: Which grade of the vaccine
 *                 example: 5
 *               isExpired:
 *                 type: boolean
 *                 description: Drive is expired or not
 *                 example: false
 *     responses:
 *       200:
 *         description: Vaccine Drive created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  status: 
 *                      type: string
 *                      example: "success"
 *                  statusCode: 
 *                      type: number
 *                      example: 201
 *                  mesage: 
 *                      type: string
 *                      example: "Vaccine Drive Registered succesfully"
 *       500:
 *         description: Failed create drive
 */
router.post("/", vaccineDriveController.createVaccineDrive);

/**
 * @swagger
 * /drives:
 *   get:
 *     summary: Lists Vaccination drive.
 *     description: List all The vaccination drive in the database.
 *     tags: [Vaccination Drive APIS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Files downloaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Query Successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 399c557d-5f50-42b5-9a48-cc05091e0e12
 *                       vaccineName:
 *                         type: string
 *                         example: COVI-SHILD
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-20T00:00:00.000Z
 *                       grades:
 *                         type: string
 *                         example: "5"
 *                       isExpired:
 *                         type: boolean
 *                         example: false
 *       500:
 *         description: Failed to query
 */
router.get("/", vaccineDriveController.listVaccineDrive);

/**
 * @swagger
 * /drives/upcoming:
 *   get:
 *     summary: Lists of upcoming Vaccination drives.
 *     description: List all The vaccination drive in the database which are coming next 30 days.
 *     tags: [Vaccination Drive APIS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Files downloaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Query Successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 399c557d-5f50-42b5-9a48-cc05091e0e12
 *                       vaccineName:
 *                         type: string
 *                         example: COVI-SHILD
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-20T00:00:00.000Z
 *                       grades:
 *                         type: string
 *                         example: "5"
 *                       isExpired:
 *                         type: boolean
 *                         example: false
 *       500:
 *         description: Failed to query
 */
router.get("/upcoming", vaccineDriveController.upcomingDrive);

/**
 * @swagger
 * /drives/{driveID}:
 *   get:
 *     summary: Get vaccination drive by ID
 *     description: Fetches details of a vaccination drive using its ID.
 *     tags: [Vaccination Drive APIS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: driveID
 *         required: true
 *         description: MongoDB ObjectId of the vaccination drive
 *         schema:
 *           type: string
 *           example: 399c557d-5f50-42b5-9a48-cc05091e0e12
 *     responses:
 *       200:
 *         description: Drive fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Drive fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 399c557d-5f50-42b5-9a48-cc05091e0e12
 *                     vaccineName:
 *                       type: string
 *                       example: COVI-SHILD
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-20T00:00:00.000Z
 *                     grades:
 *                       type: string
 *                       example: "5"
 *                     isExpired:
 *                       type: boolean
 *                       example: false
 *       404:
 *         description: Drive not found
 *       500:
 *         description: Failed to fetch drive details
 */
router.get("/:driveID", vaccineDriveController.getDriveByID);

/**
 * @swagger
 * /drives/{driveID}:
 *   put:
 *     summary: Update a future vaccination drive
 *     description: Updates a vaccination drive only if its scheduled date is in the future.
 *     tags: [Vaccination Drive APIS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: driveID
 *         required: true
 *         description: MongoDB ObjectId of the vaccination drive
 *         schema:
 *           type: string
 *           example: 399c557d-5f50-42b5-9a48-cc05091e0e12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               vaccineName: COVI-SHIELD UPDATED
 *               grades: "6"
 *     responses:
 *       200:
 *         description: Drive updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Drive updated successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Drive not found or already expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Drive not found
 *       404:
 *         description: Drive not found
 *       500:
 *         description: Failed to update drive
 */
router.put("/:driveID", vaccineDriveController.editDriveByID);

/**
 * @swagger
 * /drives/{driveID}/disable:
 *   put:
 *     summary: Expire a vaccination drive
 *     description: Marks a vaccination drive as expired by setting `isExpired` to true.
 *     tags: [Vaccination Drive APIS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: driveID
 *         required: true
 *         description: MongoDB Object Id of the vaccination drive
 *         schema:
 *           type: string
 *           example: 399c557d-5f50-42b5-9a48-cc05091e0e12
 *     responses:
 *       200:
 *         description: Drive disabled (expired) successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Drive disabled (expired) successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Drive is already expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Drive is already expired
 *       404:
 *         description: Drive not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Drive not found
 *       500:
 *         description: Failed to disable drive
 */

router.put("/:driveID/disable", vaccineDriveController.markDriveExpired);

module.exports = router;

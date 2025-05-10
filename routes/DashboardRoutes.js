const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/DashboardController");
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
 * /dashboard/overview:
 *   get:
 *     summary: Get dashboard overview metrics
 *     description: Returns total students, vaccinated count, vaccinated percentage, number of upcoming drives, and list of upcoming drives.
 *     tags: [Dashboard APIs]
 *     responses:
 *       200:
 *         description: Dashboard overview metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalStudents:
 *                   type: integer
 *                   example: 100
 *                 vaccinatedCount:
 *                   type: integer
 *                   example: 60
 *                 vaccinatedPercent:
 *                   type: string
 *                   example: "60.00"
 *                 upcomingDrivesCount:
 *                   type: integer
 *                   example: 2
 *                 upcomingDrives:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6634567890abcd
 *                       id:
 *                         type: string
 *                         example: drive-1
 *                       vaccineName:
 *                         type: string
 *                         example: Covishield
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-05-18T00:00:00.000Z"
 *                       availableDoses:
 *                         type: integer
 *                         example: 100
 *                       grades:
 *                         type: string
 *                         example: "5,6"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/overview", dashboardController.dashboardOverview);


/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get detailed aggregated dashboard statistics
 *     description: Returns total student count, class-wise vaccination stats, and most-used vaccines.
 *     tags: [Dashboard APIs]
 *     responses:
 *       200:
 *         description: Dashboard statistics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalStudents:
 *                   type: integer
 *                   example: 120
 *                 vaccinationByClass:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       class:
 *                         type: string
 *                         example: "5"
 *                       total:
 *                         type: integer
 *                         example: 30
 *                       vaccinated:
 *                         type: integer
 *                         example: 27
 *                       vaccinatedPercent:
 *                         type: string
 *                         example: "90.00"
 *                 mostUsedVaccines:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "MMR"
 *                       count:
 *                         type: integer
 *                         example: 45
 *       404:
 *         description: No students or drives found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No students or drives found
 *       500:
 *         description: Internal server error while generating dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error while generating dashboard statistics
 *                 error:
 *                   type: string
 *                   example: Database query failed
 */

router.get("/stats", dashboardController.getStats);
module.exports = router;

const express = require("express");
const router = express.Router();

const dashboardControllr = require("../controllers/DashboardController");
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
router.get("/overview", dashboardControllr.dashboardOverview);



module.exports = router;

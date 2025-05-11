const express = require("express");
const router = express.Router();

const reportController = require("../controllers/ReportController");
const authMiddleware = require("../middlewares/authMiddleware");
/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get filtered vaccination report
 *     description: Returns a list of student vaccination records filtered by vaccine name and/or date range, with pagination support.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: vaccineName
 *         schema:
 *           type: string
 *         description: Filter by vaccine name (e.g., Covishield)
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Filtered vaccination records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRecords:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 records:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       studentID:
 *                         type: string
 *                         example: stu-1
 *                       name:
 *                         type: string
 *                         example: Akshay
 *                       class:
 *                         type: string
 *                         example: "6"
 *                       vaccineName:
 *                         type: string
 *                         example: Covishield
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-05-15T00:00:00.000Z"
 *                       driveId:
 *                         type: string
 *                         example: drive-1
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid date format or query parameter
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
router.get("/", reportController.getFilteredReports);


/**
 * @swagger
 * /reports/export:
 *   get:
 *     summary: Export vaccination reports
 *     description: Exports student vaccination reports filtered by vaccine name and/or date range in CSV, PDF, or Excel format.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *           enum: [csv, pdf, xls]
 *         description: Export format (csv, pdf, or xls)
 *       - in: query
 *         name: vaccineName
 *         schema:
 *           type: string
 *         description: Filter by vaccine name (optional)
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Report exported successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid format provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid format. Use csv, pdf, or xls.
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
router.get("/export", reportController.exportReports);

module.exports = router;

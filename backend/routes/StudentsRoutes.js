const express = require("express");
const router = express.Router();

const studentsController = require("../controllers/StudentsController");
const upload = require('../middlewares/upload');
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
 * components:
 *   schemas:
 *     VaccinationRecord:
 *       type: object
 *       properties:
 *         driveId:
 *           type: string
 *           example: abc123
 *         vaccineName:
 *           type: string
 *           example: COVAXIN
 *         date:
 *           type: string
 *           format: date
 *           example: 2025-04-01
 *     Student:
 *       type: object
 *       properties:
 *         studentID:
 *           type: string
 *           example: STU001
 *         name:
 *           type: string
 *           example: Aryan Kumar
 *         className:
 *           type: string
 *           example: 6B
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *           example: Male
 *         dob:
 *           type: string
 *           format: date
 *           example: 2014-02-15
 *         vaccinationRecords:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VaccinationRecord'
 */

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Add a new student
 *     description: Creates a new student with optional vaccination records.
 *     tags: [Students APIs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentID
 *               - name
 *               - className
 *               - gender
 *               - dob
 *             properties:
 *               studentID:
 *                 type: string
 *                 example: STU001
 *               name:
 *                 type: string
 *                 example: Aryan Kumar
 *               className:
 *                 type: string
 *                 example: 6B
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: Male
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 2014-02-15
 *               vaccinationRecords:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     driveId:
 *                       type: string
 *                       example: abc123
 *                     vaccineName:
 *                       type: string
 *                       example: COVAXIN
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: 2025-04-01
 *     responses:
 *       201:
 *         description: Student created successfully
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
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Student created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Student already exists
 *       500:
 *         description: Internal server error
 */
router.post("/", studentsController.addStudent);

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get list of students
 *     description: Retrieve a list of students with optional filters for class, name, and vaccination status.
 *     tags: [Students APIs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: class
 *         schema:
 *           type: string
 *         description: Filter by student class
 *         example: 6B
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by partial or full student name (case-insensitive)
 *         example: aryan
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [vaccinated, not_vaccinated]
 *         description: Filter by vaccination status
 *         example: vaccinated
 *     responses:
 *       200:
 *         description: Students fetched successfully
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
 *                   example: Students fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *       500:
 *         description: Internal server error
 */
router.get("/", studentsController.listStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get student details by ID
 *     description: Retrieve details of a single student using their studentId.
 *     tags: [Students APIs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The studentId of the student
 *         schema:
 *           type: string
 *           example: STU001
 *     responses:
 *       200:
 *         description: Student fetched successfully
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
 *                   example: Student fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid student ID format
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
 *                   example: Invalid student ID
 *       404:
 *         description: Student not found
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
 *                   example: Student not found
 *       500:
 *         description: Internal server error
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
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/:studentID", studentsController.getStudentById);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Edit student details
 *     description: Update the details of an existing student using their studentId.
 *     tags: [Students APIs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The studentId of the student
 *         schema:
 *           type: string
 *           example: STU001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully
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
 *                   example: Student updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Validation error
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
 *                   example: Invalid input data
 *       404:
 *         description: Student not found
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
 *                   example: Student not found
 *       500:
 *         description: Internal server error
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
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.put("/:studentID", studentsController.updateStudent);

/**
 * @swagger
 * /students/import:
 *   post:
 *     summary: Bulk import students from CSV
 *     description: Upload a CSV file to bulk import student records.
 *     tags: [Students APIs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Students imported successfully
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
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: 10 students imported. 2 skipped (already exist).
 *       400:
 *         description: Invalid file format or CSV parsing error
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
 *                   example: Invalid CSV format or missing fields
 *       500:
 *         description: Failed to import students due to server error
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
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Failed to import students
 */

router.post("/import", upload.single("file"), studentsController.bulkStudentUpload);

/**
 * @swagger
 * /students/{id}/vaccinate:
 *   post:
 *     summary: Mark a student as vaccinated for a drive
 *     description: Adds a vaccination record to a student based on studentID. Prevents duplicate entries for the same drive.
 *     tags: [Students APIs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Student ID (studentID)
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driveId
 *               - vaccineName
 *               - date
 *             properties:
 *               driveId:
 *                 type: string
 *                 example: "drive-1234"
 *               vaccineName:
 *                 type: string
 *                 example: "COVI-SHIELD"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-20"
 *     responses:
 *       200:
 *         description: Student marked as vaccinated
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
 *                   example: Student marked as vaccinated
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Missing or invalid request body
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
 *                   example: driveId, vaccineName, and date are required
 *       404:
 *         description: Student not found
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
 *                   example: Student not found
 *       409:
 *         description: Duplicate vaccination record
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
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: Student already vaccinated for this drive
 *       500:
 *         description: Internal server error
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
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post("/:studentID/vaccinate", studentsController.vaccinateStudent);


module.exports = router;
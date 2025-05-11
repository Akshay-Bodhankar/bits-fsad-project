const fs = require("fs");
const csv = require("csv-parser");
const studentModel = require("../models/StudentsModel");
const driveModel = require("../models/DriveModel");
const logger = require("../lib/logger.js");

const addStudent = async (req, res) => {
    logger.info("Inside addStudent function");
    try {
        const { studentID, name, className, gender, dob, vaccinationRecords } = req.body;

        const studentExists = await studentModel.findOne({ studentID });
        if (studentExists) {
            return res.status(400).json({
                status: "error",
                statusCode: 400,
                message: "Student already exists"
            });
        }

        const newStudent = new studentModel({
            studentID,
            name,
            class: className,
            gender,
            dob,
            vaccinationRecords: vaccinationRecords || []
        })

        const savedStudent = await newStudent.save();
        res.status(201).json({
            status: "success",
            statusCode: 201,
            message: "Student created successfully",
            data: savedStudent
        });
    }
    catch (error) {
        logger.error("Error creating student: " + error);
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: "Internal server error" + error
        });
    }
}

const listStudents = async (req, res) => {
    logger.info("Inside listStudents function");
    try {
        const { class: classFilter, name, status } = req.query;
        const filter = {};

        if (classFilter) {
            filter.class = classFilter;
        }
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        if (status === "vaccinated") {
            filter.vaccinationRecords = { $exists: true, $ne: [] };
        } else if (status === "not_vaccinated") {
            filter.vaccinationRecords = { $eq: [] };
        }

        const students = await studentModel.find(filter);
        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Students retrieved successfully",
            data: students
        });
    }
    catch (error) {
        logger.error("Error listing students: " + error);
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: "Internal server error" + error
        });
    }
};

const getStudentById = async (req, res) => {
    logger.info("Inside getStudentById function");
    try {
        const { studentID } = req.params;

        const student = await studentModel.findOne({ studentID });
        if (!student) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: "Student not found"
            });
        }
        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Student retrieved successfully",
            data: student
        });
    }
    catch (error) {
        logger.error("Error retrieving student: " + error);
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: "Internal server error" + error
        });
    }
};

const updateStudent = async (req, res) => {
    logger.info("Inside updateStudent function");
    try {
        const { studentID } = req.params;
        const updatedStudentInfo = req.body;

        const student = await studentModel.find({ studentID });
        if (!student) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: "Student not found"
            });
        }
        const updatedStudent = await studentModel.findByIdAndUpdate(student._id, req.body, { new: true, runValidators: true });
        if (!updatedStudent) {
            return res.status(400).json({
                status: "error",
                statusCode: 400,
                message: "Failed to update student"
            });
        }
        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Student updated successfully",
            data: updatedStudent
        });
    }
    catch (error) {
        logger.error("Error updating student: " + error);
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: "Internal server error" + error
        });
    }
}

const bulkStudentUpload = async (req, res) => {
    logger.info("Inside bulkStudentUpload function");
    const file = req.file;

    if (!file) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "CSV file is required",
        });
    }

    const students = [];
    const imported = [];
    const skipped = [];

    try {
        fs.createReadStream(file.path)
            .pipe(csv())
            .on("data", (row) => {
                students.push({
                    studentID: row.studentID,
                    name: row.name,
                    class: row.class,
                    gender: row.gender,
                    dob: new Date(row.dob),
                    vaccinationRecords: [],
                });
            })
            .on("end", async () => {
                try {
                    for (const s of students) {
                        const exists = await studentModel.findOne({ studentID: s.studentID });
                        if (exists) skipped.push(s.studentID);
                        else imported.push(s);
                    }

                    if (imported.length > 0) {
                        logger.info("imported", imported);
                        await studentModel.insertMany(imported, { ordered: false, new: true });
                    }

                    fs.unlinkSync(file.path); // Clean up uploaded file

                    return res.status(201).json({
                        status: "success",
                        statusCode: 201,
                        message: `${imported.length} students imported. ${skipped.length} skipped.`,
                        imported: imported.length,
                        skipped: skipped.length,
                        skippedIds: skipped,
                    });
                } catch (error) {
                    logger.error("DB insert error: " + error);
                    return res.status(500).json({
                        status: "error",
                        statusCode: 500,
                        message: "Failed to import students",
                    });
                }
            })
            .on("error", (error) => {
                logger.error("CSV parsing error: " + error);
                return res.status(400).json({
                    status: "error",
                    statusCode: 400,
                    message: "Invalid CSV format",
                });
            });
    } catch (err) {
        logger.error("Unexpected error: " + err);
        return res.status(500).json({
            status: "error",
            statusCode: 500,
            message: "Internal Server Error",
        });
    }
};

const vaccinateStudent = async (req, res) => {

    const studentID = req.params.studentID;
    const { driveId, vaccineName, date } = req.body;

    if (!driveId || !vaccineName || !date) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "driveId, vaccineName, and date are required",
        });
    }
    logger.info("studentID", studentID);
    try {
        const student = await studentModel.findOne({ studentID });
        logger.info("Student found:", student);
        if (!student) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: "Student not found",
            });
        }

        const alreadyVaccinated = student.vaccinationRecords.some(
            (record) => record.driveId === driveId
        );

        if (alreadyVaccinated) {
            return res.status(409).json({
                status: "error",
                statusCode: 409,
                message: "Student already vaccinated for this drive",
            });
        }

        const drive = await driveModel.findOne({ id: driveId });
        if (!drive) {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: "Vaccination drive not found",
            });
        }

        if (drive.availableDoses <= 0) {
            return res.status(400).json({
                status: "error",
                statusCode: 400,
                message: "No available doses left for this drive",
            });
        }

        drive.availableDoses -= 1;
        await drive.save();

        student.vaccinationRecords.push({ driveId, vaccineName, date });
        await student.save();

        return res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Student marked as vaccinated",
            data: student,
        });
    } catch (err) {
        logger.error("Vaccination error: " + err);
        return res.status(500).json({
            status: "error",
            statusCode: 500,
            message: "Internal server error",
        });
    }
};

module.exports = {
    addStudent,
    listStudents,
    getStudentById,
    updateStudent,
    bulkStudentUpload,
    vaccinateStudent
};
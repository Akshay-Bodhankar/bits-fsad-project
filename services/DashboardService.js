const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const vaccineDriveModel = require("../models/DriveModel");
const studentModel = require("../models/StudentsModel.js");
const { v4: uuidv4 } = require("uuid");
const logger = require("../lib/logger.js");


const dashboardOverview = async (req, res) => {
    logger.info("Inside dashboard overview function");
    try {
        const totalStudents = await studentModel.countDocuments();

        // Count students who have at least 1 vaccination record
        const vaccinatedCount = await studentModel.countDocuments({
            vaccinationRecords: { $exists: true, $not: { $size: 0 } }
        });

        const vaccinatedPercent = totalStudents > 0
            ? ((vaccinatedCount / totalStudents) * 100).toFixed(2)
            : 0;

        const today = new Date();
        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30);

        const upcomingDrives = await vaccineDriveModel.find({
            date: { $gte: today, $lte: next30Days },
            isExpired: false
        }).select('id vaccineName date availableDoses grades');

        const upcomingDrivesCount = upcomingDrives.length;
        res.status(200).send({
            status: "success",
            statusCode: 201,
            mesage: "Overview Fetched succesfully.",
            data: {
                totalStudents,
                vaccinatedCount,
                vaccinatedPercent,
                upcomingDrivesCount,
                upcomingDrives
            }
        })
    } catch (error) {
        logger.error("Error creating vaccine drive: " + error);
        res.status(400).send({
            status: "failed",
            statusCode: 400,
            errorMessage: "Error occured while creating vaccine drive: " + error
        });
    }

};
module.exports = {
    dashboardOverview
};
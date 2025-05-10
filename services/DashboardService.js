const vaccineDriveModel = require("../models/DriveModel");
const studentModel = require("../models/StudentsModel.js");
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

const getStats = async (req, res) => {
    try {
        const students = await studentModel.find({});
        const drives = await vaccineDriveModel.find({});

        if (!students.length || !drives.length) {
            logger.warn("No students or drives found for stats");
            return res.status(404).json({ message: "No students or drives found" });
        }

        const stats = {
            totalStudents: students.length,
            byClass: {},
            topVaccines: {}
        };

        students.forEach(student => {
            const cls = student.class;
            if (!stats.byClass[cls]) {
                stats.byClass[cls] = { total: 0, vaccinated: 0 };
            }

            stats.byClass[cls].total += 1;

            if (student.vaccinationRecords?.length) {
                stats.byClass[cls].vaccinated += 1;

                student.vaccinationRecords.forEach(record => {
                    const vaccine = record.vaccineName;
                    if (vaccine) {
                        stats.topVaccines[vaccine] = (stats.topVaccines[vaccine] || 0) + 1;
                    }
                });
            }
        });

        const response = {
            status: "success",
            statusCode: 201,
            mesage: "Overview Fetched succesfully.",
            data: {
                totalStudents: stats.totalStudents,
                vaccinationByClass: Object.entries(stats.byClass).map(([cls, data]) => ({
                    class: cls,
                    total: data.total,
                    vaccinated: data.vaccinated,
                    vaccinatedPercent: ((data.vaccinated / data.total) * 100).toFixed(2)
                })),
                mostUsedVaccines: Object.entries(stats.topVaccines)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count)
            }
        };

        logger.info("Dashboard stats generated successfully");
        res.status(201).json(response);
    } catch (err) {
        logger.error("Error generating dashboard stats " + { error: err.message });
        res.status(500).json({
            status: "failed",
            statusCode: 500,
            message: "Internal server error while generating dashboard statistics",
            error: err.message
        });
    }
}

module.exports = {
    dashboardOverview,
    getStats
};
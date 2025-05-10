const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const vaccineDriveModel = require("../models/DriveModel");
const { v4: uuidv4 } = require("uuid");

const createVaccineDrive = async (req, res) => {
    console.log("Inside createVaccine drive: ")
    const { vaccineName, date, avilableDoses, grades, isExpired } = req.body;
    const id = uuidv4();

    try {
        const vaccineDrive = new vaccineDriveModel({
            id,
            vaccineName: vaccineName,
            date,
            avilableDoses,
            grades,
            isExpired
        })
        await vaccineDrive.save();
        console.log("The vaccine drive is saved");
        res.status(201).send({
            status: "success",
            statusCode: 201,
            mesage: "Vaccine Drive Registered succesfully"
        });
    }
    catch (error) {
        res.status(400).send({
            status: "failed",
            statusCode: 400,
            errorMessage: "Error occured while creating vaccine drive: " + error
        });
    }
}

const listDrives = async (req, res) => {
    console.log("Inside list drives functions");
    try {
        const vaccineDriveRecords = await vaccineDriveModel.find();
        console.log("The vaccineDriveRecords: ", vaccineDriveRecords);
        res.status(200).send({
            status: "success",
            statusCode: 200,
            message: "Query Successful",
            data: vaccineDriveRecords
        });
    }
    catch (error) {
        res.status(400).send({
            status: "failed",
            statusCode: 400,
            errorMessage: "Error occured while querying vaccine drive: " + error
        });
    }
}

const upcomingDrives = async (req, res) => {
    console.log("Inside upcomingDrives");
    try {
        const currentDate = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(currentDate.getDate() + 30);

        const vaccineDrives = await vaccineDriveModel.find({
            date: { $gte: currentDate, $lte: thirtyDaysLater }
        })
        return res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Upcoming drives fetched successfully",
            data: vaccineDrives
        });
    }
    catch (error) {
        res.status(400).send({
            status: "failed",
            statusCode: 400,
            errorMessage: "Error occured while querying vaccine drive: " + error
        });
    }
}

const getDriveByID = async (req, res) => {
    console.log("Inside getDriveByID");
    try {
        const { driveID } = req.params;

        const drive = await vaccineDriveModel.findOne({ id: driveID });
        console.log("the drive is: ", drive);
        return res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Drive fetched successfully",
            data: drive
        })
    }
    catch (error) {
        res.status(400).send({
            status: "failed",
            statusCode: 400,
            errorMessage: "Error occured while querying vaccine drive: " + error
        });
    }
}

const editDriveByID = async (req, res) => {
    console.log("Inside editDriveByID");;
    try {
        const { driveID } = req.params;
        const newDriveData = req.body;
        const drive = await vaccineDriveModel.findOne({ id: driveID });

        if (!drive) {
            return res.status(404).json({
                status: "error",
                statusCode: 400,
                message: "Drive not found"
            })
        }
        const currentDate = new Date();
        if (new Date(drive.date) <= currentDate) {
            return res.status(400).json({
                status: "error",
                statusCode: 400,
                message: "Cannot update past or current drives",
            });
        }
        const updatedDrive = await vaccineDriveModel.findByIdAndUpdate(drive._id, newDriveData, {
            new: true,
            runValidators: true
        })
        console.log("The updated drive is: ", updatedDrive);
        return res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Drive updated successfully",
            data: updatedDrive,
        });
    }
    catch (error) {
        res.status(400).send({
            status: "failed",
            statusCode: 400,
            errorMessage: "Error occured while querying vaccine drive: " + error
        });
    }
}

const markDriveExpired = async (req, res) => {
    console.log("Inside markDriveExpire");
    try {
        const { driveID } = req.params;

        const driveData = await vaccineDriveModel.findOne({ id: driveID });
        if (!driveData) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Drive not found',
            });
        }

        if (driveData.isExpired) {
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'Drive is already expired',
            });
        }

        const updatedDrive = await vaccineDriveModel.findByIdAndUpdate(driveData._id, { isExpired: true }, { new: true });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Drive disabled (expired) successfully',
            data: updatedDrive
        });
    } catch (error) {
        res.status(400).send({
            status: "failed",
            statusCode: 400,
            errorMessage: "Failed to disable drive: " + error
        });
    }
}
module.exports = {
    createVaccineDrive,
    listDrives,
    upcomingDrives,
    getDriveByID,
    editDriveByID,
    markDriveExpired
};
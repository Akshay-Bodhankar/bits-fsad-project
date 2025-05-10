const vaccineDriveService = require("../services/VaccineDriveService");

const createVaccineDrive = async (req, res) => {
    await vaccineDriveService.createVaccineDrive(req, res);
};

const listVaccineDrive = async (req, res) => {
    await vaccineDriveService.listDrives(req, res);
};

const upcomingDrive = async (req, res) => {
    await vaccineDriveService.upcomingDrives(req, res);
};

const getDriveByID = async (req, res) => {
    await vaccineDriveService.getDriveByID(req, res);
}

const editDriveByID = async(req, res) => {
    await vaccineDriveService.editDriveByID(req, res);
}

const markDriveExpired = async(req, res) => {
    await vaccineDriveService.markDriveExpired(req, res);
}

module.exports = {
    createVaccineDrive,
    listVaccineDrive,
    upcomingDrive,
    getDriveByID,
    editDriveByID,
    markDriveExpired
};
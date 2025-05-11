const studentsService = require("../services/StudentsService");

const addStudent = async (req, res) => {
    await studentsService.addStudent(req, res);
};

const listStudents = async (req, res) => {
    await studentsService.listStudents(req, res);
};

const getStudentById = async (req, res) => {
    await studentsService.getStudentById(req, res);
};

const updateStudent = async (req, res) => {
    await studentsService.updateStudent(req, res);
};

const bulkStudentUpload  = async (req, res) => {
    await studentsService.bulkStudentUpload(req, res);
};

const vaccinateStudent = async (req, res) => {
    await studentsService.vaccinateStudent(req, res);
};
module.exports = {
    addStudent,
    listStudents,
    getStudentById,
    updateStudent,
    bulkStudentUpload,
    vaccinateStudent
};
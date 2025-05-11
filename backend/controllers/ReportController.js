const reportService = require("../services/ReportService");

const getFilteredReports = async (req, res) => {
    await reportService.getFilteredReports(req, res);
}

const exportReports = async (req, res) => {
    await reportService.exportReports(req, res);
}
module.exports = {
    getFilteredReports,
    exportReports
};
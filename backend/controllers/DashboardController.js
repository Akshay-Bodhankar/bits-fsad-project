const dashboardService = require("../services/DashboardService");

const dashboardOverview = async (req, res) => {
    await dashboardService.dashboardOverview(req, res);
}

const getStats = async (req, res) => {
    await dashboardService.getStats(req, res);
}

module.exports = {
    dashboardOverview,
    getStats
};
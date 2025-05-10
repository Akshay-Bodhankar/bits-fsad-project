const dashboardService = require("../services/DashboardService");

const dashboardOverview = async (req, res) => {
    await dashboardService.dashboardOverview(req, res);
}

module.exports = {
    dashboardOverview
};
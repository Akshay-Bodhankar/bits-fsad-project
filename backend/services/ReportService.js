const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const studnetModel = require("../models/StudentsModel");
const logger = require("../lib/logger.js");

const getFilteredReports = async (req, res) => {
    try {
        const { vaccineName, fromDate, toDate, page = 1, limit = 10 } = req.query;

        const matchStage = {};

        if (vaccineName) {
            matchStage["vaccinationRecords.vaccineName"] = vaccineName;
        }

        if (fromDate || toDate) {
            matchStage["vaccinationRecords.date"] = {};
            if (fromDate) matchStage["vaccinationRecords.date"].$gte = new Date(fromDate);
            if (toDate) matchStage["vaccinationRecords.date"].$lte = new Date(toDate);
        }

        const pipeline = [
            { $unwind: "$vaccinationRecords" },
            { $match: matchStage },
            {
                $project: {
                    studentID: 1,
                    name: 1,
                    class: 1,
                    vaccineName: "$vaccinationRecords.vaccineName",
                    date: "$vaccinationRecords.date",
                    driveId: "$vaccinationRecords.driveId"
                }
            },
            { $sort: { date: -1 } },
            { $skip: (parseInt(page) - 1) * parseInt(limit) },
            { $limit: parseInt(limit) }
        ];

        const results = await studnetModel.aggregate(pipeline);

        const totalCountPipeline = [
            { $unwind: "$vaccinationRecords" },
            { $match: matchStage },
            { $count: "total" }
        ];

        const totalResult = await studnetModel.aggregate(totalCountPipeline);
        const totalRecords = totalResult.length > 0 ? totalResult[0].total : 0;

        res.status(200).send({
            status: "success",
            statusCode: 201,
            mesage: "Report Fetched succesfully.",
            data: {
                totalRecords,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalRecords / parseInt(limit)),
                records: results
            }
        });
    } catch (error) {
        logger.error("Report Error: " + error);
        res.status(500).send({
            status: "failed",
            statusCode: 500,
            errorMessage: "Error occured while fetching report: " + error
        });
    }
};



const exportReports = async (req, res) => {
    try {
        const { vaccineName, fromDate, toDate, format = "csv" } = req.query;

        const match = {};
        if (vaccineName) match["vaccinationRecords.vaccineName"] = vaccineName;
        if (fromDate || toDate) {
            match["vaccinationRecords.date"] = {};
            if (fromDate) match["vaccinationRecords.date"].$gte = new Date(fromDate);
            if (toDate) match["vaccinationRecords.date"].$lte = new Date(toDate);
        }

        const data = await studnetModel.aggregate([
            { $unwind: "$vaccinationRecords" },
            { $match: match },
            {
                $project: {
                    studentID: 1,
                    name: 1,
                    class: 1,
                    vaccineName: "$vaccinationRecords.vaccineName",
                    driveId: "$vaccinationRecords.driveId",
                    date: "$vaccinationRecords.date"
                }
            },
            { $sort: { date: -1 } }
        ]);

        const filename = `vaccination_report.${format}`;

        if (format === "csv") {
            const parser = new Parser();
            const csv = parser.parse(data);
            res.header("Content-Type", "text/csv");
            res.attachment(filename);
            return res.send(csv);
        }

        if (format === "xls") {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("Report");

            sheet.columns = [
                { header: "Student ID", key: "studentID" },
                { header: "Name", key: "name" },
                { header: "Class", key: "class" },
                { header: "Vaccine Name", key: "vaccineName" },
                { header: "Drive ID", key: "driveId" },
                { header: "Date", key: "date" }
            ];

            sheet.addRows(data.map(record => ({
                ...record,
                date: new Date(record.date).toISOString().split("T")[0]
            })));

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
            await workbook.xlsx.write(res);
            res.end();
            return;
        }

        if (format === "pdf") {
            const doc = new PDFDocument({ margin: 30 });
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
            doc.pipe(res);

            doc.fontSize(18).text("Vaccination Report", { align: "center" });
            doc.moveDown();

            data.forEach((item, i) => {
                doc.fontSize(12).text(
                    `${i + 1}. ${item.name} (${item.studentID}, Class ${item.class}) - ${item.vaccineName} on ${new Date(item.date).toISOString().split("T")[0]} [Drive: ${item.driveId}]`
                );
            });

            doc.end();
            return;
        }
        return res.status(400).json({
            status: "failed",
            statusCode: 400,
            errorMessage: "Invalid format. Use csv, pdf, or xls."
        });

    } catch (error) {
        logger.error("Export Error: " + error);
        res.status(500).send({
            status: "failed",
            statusCode: 500,
            errorMessage: "Error occured while creating vaccine drive: " + error
        });
    }
};

module.exports = {
    getFilteredReports,
    exportReports
};

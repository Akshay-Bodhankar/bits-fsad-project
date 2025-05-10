const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const PropertiesReader = require("properties-reader");
const properties = PropertiesReader("config/app.properties");

const setUpDB = require("./config/database.js");

const app = express();

require("dotenv").config();
require("./insertLogin.js");

app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));
app.use(bodyParser.json({ limit: "200mb" }));

setUpDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set('view engine', 'ejs');

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "DRIVE SERVICE APIS",
      version: "1.0.0",
      description: "APIs for managing drives",
    },
    servers: [
      {
        url: `http://${properties.get("server.ip")}:${properties.get("server.port")}`,
      },
    ]
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const vaccineDriveRoute = require("./routes/VaccineDriveRoutes.js");
app.use("/drives/", vaccineDriveRoute);

const authRoutes = require("./routes/AuthRoutes.js");
app.use("/api/", authRoutes);

const studentsRoutes = require("./routes/StudentsRoutes.js");
app.use("/students/", studentsRoutes);

app.get("/", function (req, res) {
  res.redirect("/api-docs");
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("The path is: ", req.originalUrl);
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


module.exports = app;

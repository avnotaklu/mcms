const express = require("express");
require("dotenv").config();
const cookies = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swagger");
const { createIndex } = require("./config/db");
const winston = require("winston");
const expressWinston = require("express-winston");


function setupApp(router) {
  const app = express();

  app.use(cookies());
  app.use(express.json());

  app.use(
    require("cors")({
      origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // Allow all origins for now
      credentials: true,
    })
  );

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        winston.format.prettyPrint()
      ),
      meta: true, // optional: control whether you want to log the meta data about the request (default to true)
      msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      ignoreRoute: function (req, res) {
        return false;
      }, // optional: allows to skip some log messages based on request and/or response
    })
  );

  app.use("/api", router);

  app.use(
    expressWinston.errorLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        winston.format.prettyPrint()
      ),
    })
  );

  return app
}

module.exports = { setupApp };

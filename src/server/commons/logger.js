import { createLogger, transports, format } from "winston";
import LokiTransport from "winston-loki";
import responseTime from "response-time";
let logger = null;
const setupLogger = (app) => {
  const LokiUrl = process.env.LOKI_URL || "";
  let options = {};
  if (LokiUrl !== "") {
    options = {
      transports: [
        new LokiTransport({
          host: process.env.LOKI_URL,
          labels: {
            origin: process.env.APP_NAME,
            application: process.env.APP_NAME,
            env: process.env.APP_ENV,
          },
          json: true,
          format: format.json(),
          replaceTimestamp: true,
          basicAuth: process.env.LOKI_BASICAUTH,
        }),
        new transports.Console({
          level: "debug",
          colorize: true,
          timestamp: function () {
            return new Date().toLocaleTimeString();
          },
          prettyPrint: true,
        }),
      ],
    };
    console.log(
      "Logger is configured and logs will be pushed to",
      process.env.LOKI_URL
    );
  } else {
    options = {
      transports: [
        new transports.Console({
          level: "debug",
          colorize: true,
          timestamp: function () {
            return new Date().toLocaleTimeString();
          },
          prettyPrint: true,
        }),
      ],
    };
    console.log("Logger is configured and will be locally stored");
  }
  logger = createLogger(options);
  app.use(responseTime(logResponseTime));
  return logger;
};

const logResponseTime = (req, res, time) => {
  logger.info({
    message: {
      app: process.env.APP_NAME,
      method: req.method,
      host: req.headers.host,
      path: req.originalUrl,
      status: res.statusCode,
      duration: time + "ms",
    },
    labels: {
      origin: process.env.APP_NAME,
      application: process.env.APP_NAME,
      env: process.env.APP_ENV,
    },
  });
};
const logError = (err, req, res, next) => {
  logger.error({
    message: {
      app: process.env.APP_NAME,
      method: req.method,
      host: req.headers.host,
      path: req.originalUrl,
      status: res.statusCode,
      error: err.stack,
    },
    labels: { application: process.env.APP_NAME },
  });
  next();
};
export { setupLogger, logError };

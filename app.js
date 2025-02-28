const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const routes = require("./routes/v1");
const logger = require("./config/logger");
const sequelize = require("./config/db"); // Import sequelize instance
const cors = require("cors");
const router = express.Router();
const helmet = require("helmet");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const ApiError = require("./utils/ApiError");
const { status: httpStatus } = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const SequelizeStore = require("connect-session-sequelize")(session.Store); // initalize sequelize with session store

// const { authLimiter } = require("./middlewares/rateLimiter");
const { errorConverter, errorHandler } = require("./middlewares/error");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
// set security HTTP headers
// app.use(helmet());

app.use(function (req, res, next) {
  try {
    logger.info(
      `CORS HEADERS :: ORIGIN :: ${req.headers.origin} :: HOST :: ${req.headers.host} :: IP ADDRESS :: ${req.ip}`
    );
  } catch (e) {
    logger.info(`CORS HEADERS CATCH :: ${e.message}`);
  }

  req.headers.origin = req.headers.origin || req.headers.host;
  next();
});

// enable cors
app.use(cors());
app.options("*", cors());

// Secure the app by setting various HTTP headers in each response
app.use(helmet({ contentSecurityPolicy: false }));
// required for csurf
// app.use(
//   session({
//     resave: true,
//     saveUninitialized: true,
//     secret: process.env.SESSION_SECRET,
//     cookie: { path: "/", httpOnly: true, maxAge: 1209600000 }, // maxAge two weeks in milliseconds, remove secure: true for local development
//     store: new SequelizeStore({
//       db: sequelize,
//       table: "sessions",
//     }),
//   })
// );
// Passport init
app.use(passport.initialize());
// app.use(passport.session());
// limit repeated failed requests to auth endpoints
// if (config.env === "production") {
//   app.use("/v1/auth", authLimiter);
// }
// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride());
app.use(cookieParser());

app.get("/ping", (req, res) => {
  return res.json({
    status: "success",
    statusCode: 200,
    message: "Success",
    data: "Ok",
    error: {},
  });
});

app.get("/currentTime", (req, res) => {
  return res.json({
    status: "success",
    statusCode: 200,
    message: "Current Time in milli seconds",
    data: Date.now(),
    error: {},
  });
});

// Routes
app.use("/api/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "This route is not supported."));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// // Sync Sequelize models with the database
// sequelize
//   .sync({ alter: true }) // or use { force: true } in development
//   .then(() => {
//     logger.info("Database synchronized successfully.");
//   })
//   .catch((error) => {
//     logger.error("Error syncing database: " + error.message);
//   });

// // Start server
// app.listen(port, () => {
//   logger.info(`Server is running on port ${port}`);
// });
module.exports = app;

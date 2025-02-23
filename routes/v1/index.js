const express = require("express");
const { env } = require("../../config/config");
const assignmentsRoute = require("./assignments.route");
const docsRoute = require("./docs.route");
const usersRoute = require("./users.route");
const otpRoute = require("./otp.route");

const router = express.Router();
const defaultRoutes = [
  {
    path: "/assignments",
    route: assignmentsRoute,
  },
  {
    path: "/users",
    route: usersRoute,
  },
  {
    path: "/otp",
    route: otpRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
/* istanbul ignore next */
if (env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;

const passport = require("../controllers/auth.controller");
const { status: httpStatus } = require("http-status");

const authenticateUser = (req, res, next) => {
  passport.authenticate("bearer", { session: false }, (err, user, info) => {
    // console.log("Auth Middleware - Error:", err);
    // console.log("Auth Middleware - User:", user);
    // console.log("Auth Middleware - Info:", info);
    if (err || !user?.userId) {
      if (err?.statusCode) {
        return res.status(err?.statusCode).json({ error: err?.message });
      } else {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ error: info?.message || "Unauthorized" });
      }
    }

    req.user = user; // Attach user data to the request
    next();
  })(req, res, next);
};

module.exports = { authenticateUser };

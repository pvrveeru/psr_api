const verifyToken = require("../middlewares/jwtVerifyToken");
const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      if (!token) {
        return done(null, false, { message: "No token provided" });
      }
      // Verify JWT
      const decodedData = await verifyToken(token, process.env.JWT_SECRET);
      // console.log("decodedData:", decodedData);
      if (!decodedData) {
        return done(null, false, { message: "Invalid token" });
      }

      // Attach user data to request
      return done(null, decodedData);
    } catch (error) {
      console.error("Token verification error:", error);
      return done(error, false, {
        message: error?.message || "Invalid or expired token",
      });
    }
  })
);
module.exports = passport;

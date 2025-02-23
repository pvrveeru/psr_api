const jwt = require("jsonwebtoken");
const { status: httpStatus } = require("http-status");

const createJwtToken = async (payload = {}) => {
  try {
    const token = jwt.sign(
      payload.data,
      process.env.JWT_SECRET, // Ensure you have this in your environment variables
      { expiresIn: payload.expiresIn }
    );
    return token;
  } catch (err) {
    console.error("Creating Access token", err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Creating Access token" });
  }
};

module.exports = createJwtToken;

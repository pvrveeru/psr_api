const { Sequelize, DataTypes } = require("@sequelize/core");
const sequelize = require("../config/db"); // Your Sequelize instance
const User = require("./user");

const OTPVerification = sequelize.define(
  "OTPVerification",
  {
    otpId: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Auto-incrementing ID
      primaryKey: true,
      allowNull: false,
      field: "otp_id", // Maps to snake_case column name in the DB
    },
    phoneNumber: {
      type: DataTypes.STRING(15), // VARCHAR(15) for phone number
      allowNull: false, // Required field
      field: "phone_number", // Maps to snake_case column name
      unique: true,
    },
    otpCode: {
      type: DataTypes.STRING(6), // VARCHAR(6) for OTP code
      allowNull: false, // Required field
      field: "otp_code", // Maps to snake_case column name
    },
    otpCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Initial count
    },
    expiresAt: {
      type: DataTypes.DATE, // TIMESTAMP for expires_at
      allowNull: false, // Required field
      field: "expires_at", // Maps to snake_case column name
    },
  },
  {
    timestamps: true, // No need for createdAt/updatedAt, since we define them explicitly
    tableName: "otp_verification", // Custom table name (optional)
    underscored: true, // This ensures snake_case column names in the DB
  }
);
OTPVerification.belongsTo(User, {
  foreignKey: "phoneNumber",
  targetKey: "phoneNumber",
});

module.exports = OTPVerification;

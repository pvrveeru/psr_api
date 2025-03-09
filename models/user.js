const { Sequelize, DataTypes } = require("@sequelize/core");
const sequelize = require("../config/db"); // Your Sequelize instance

const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Auto-incrementing ID
      primaryKey: true,
      allowNull: false,
      field: "user_id", // Maps to snake_case column name in the DB
    },
    phoneNumber: {
      type: DataTypes.STRING(15), // VARCHAR(15) for phone number
      allowNull: false, // Assuming phone number is optional
      unique: true,
      field: "phone_number", // Maps to snake_case column name
    },
    userName: {
      type: DataTypes.STRING(100), // VARCHAR(100) for name
      allowNull: true, // Required field
      field: "user_name", // Maps to snake_case column name
    },
    firstName: {
      type: DataTypes.STRING(100), // VARCHAR(100) for name
      allowNull: true, // Required field
      field: "first_name", // Maps to snake_case column name
    },
    lastName: {
      type: DataTypes.STRING(100), // VARCHAR(100) for name
      allowNull: true, // Required field
      field: "last_name", // Maps to snake_case column name
    },
    emailId: {
      type: DataTypes.STRING(100), // VARCHAR(100) for email
      allowNull: true, // Required field
      unique: true, // Ensure email is unique
      field: "email_id", // Maps to snake_case column name
    },
    gender: {
      type: DataTypes.STRING(10), // VARCHAR(10) for gender
      allowNull: true, // Optional field
      field: "gender", // Maps to snake_case column name
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY, // DATE for birthdate (no time)
      allowNull: true, // Optional field
      field: "date_of_birth", // Maps to snake_case column name
    },
    country: {
      type: DataTypes.STRING(100), // VARCHAR(100) for country
      allowNull: true, // Optional field
      field: "country", // Maps to snake_case column name
    },
    city: {
      type: DataTypes.STRING(100), // VARCHAR(100) for city
      allowNull: true, // Optional field
      field: "city", // Maps to snake_case column name
    },
    state: {
      type: DataTypes.STRING(100), // VARCHAR(100) for state
      allowNull: true, // Optional field
      field: "state", // Maps to snake_case column name
    },
    notificationsEnabled: {
      type: DataTypes.BOOLEAN, // BOOLEAN for notifications_enabled
      allowNull: true, // Default to false if not provided
      field: "notifications_enabled", // Maps to snake_case column name
      defaultValue: true, // Default to true (notifications enabled by default)
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "phone_verified",
      defaultValue: false,
    },
    accountVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "account_verified",
      defaultValue: false,
    },
    accountVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "account_verified",
      defaultValue: false,
    },
    accountStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "account_status",
      defaultValue: 1, // 1-active,2-Inactive,3-deleted
    },
    darkModeEnabled: {
      type: DataTypes.BOOLEAN, // BOOLEAN for dark_mode_enabled
      allowNull: true, // Default to false if not provided
      field: "dark_mode_enabled", // Maps to snake_case column name
      defaultValue: false, // Default to false (dark mode disabled by default)
    },
    profileImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "profile_image_url",
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "role",
      defaultValue: "user",
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "device_id",
    },
    setDeviceId: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "set_device_id",
    },
    address: {
      type: DataTypes.STRING(200), // VARCHAR(100) for state
      allowNull: true, // Optional field
      field: "address", // Maps to snake_case column name
    },
    // createdAt: {
    //   type: DataTypes.DATE, // TIMESTAMP for created_at
    //   allowNull: true, // Required field
    //   field: "created_at", // Maps to snake_case column name
    //   defaultValue: sequelize.NOW, // Automatically set the current timestamp
    // },
  },
  {
    timestamps: true, // We are defining the `createdAt` field explicitly, so no need for automatic createdAt/updatedAt fields
    tableName: "users", // Custom table name (optional)
    underscored: true, // Converts camelCase to snake_case in the DB
  }
);

module.exports = User;

const { Sequelize, DataTypes } = require("@sequelize/core");
const sequelize = require("../config/db"); // Your Sequelize instance

const Admin = sequelize.define(
  "Admin",
  {
    adminId: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Auto-incrementing ID
      primaryKey: true,
      allowNull: false,
      field: "admin_id", // Maps to snake_case column name in the DB
    },
    username: {
      type: DataTypes.STRING(100), // VARCHAR(100) for the admin's username
      allowNull: false, // Required field
      unique: true, // Ensures unique username
      field: "username", // Maps to snake_case column name
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "role",
      defaultValue: "admin", // Default value for role
    },
    password: {
      type: DataTypes.TEXT, // TEXT for storing hashed password
      allowNull: false, // Required field
      field: "password", // Maps to snake_case column name
    },
    createdAt: {
      type: DataTypes.DATE, // TIMESTAMP for created_at
      allowNull: true, // Required field
      field: "created_at", // Maps to snake_case column name
      defaultValue: sequelize.NOW, // Automatically set the current timestamp
    },
  },
  {
    timestamps: false, // We only need createdAt here, not updatedAt
    tableName: "admins", // Custom table name (optional)
    underscored: true, // Ensures snake_case column names in the DB
  }
);

module.exports = Admin;

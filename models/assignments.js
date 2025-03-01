const { Sequelize, DataTypes } = require("@sequelize/core");
const sequelize = require("../config/db"); // Your Sequelize instance
const Assignor = require("./assignor");

const Assignments = sequelize.define(
  "Assignments",
  {
    assignmentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Auto-incrementing ID
      primaryKey: true,
      allowNull: false,
      field: "assignment_id", // Maps to snake_case column name in the DB
    },
    name: {
      type: DataTypes.STRING(100), // VARCHAR(15) for phone number
      allowNull: false, // Assuming phone number is optional
      field: "name", // Maps to snake_case column name
    },
    clientName: {
      type: DataTypes.STRING(100), // VARCHAR(100) for name
      allowNull: true, // Required field
      field: "client_name", // Maps to snake_case column name
    },
    siteId: {
      type: DataTypes.STRING(100), // VARCHAR(100) for name
      allowNull: true, // Required field
      field: "site_id", // Maps to snake_case column name
    },
    activity: {
      type: DataTypes.STRING(200), // VARCHAR(100) for name
      allowNull: true, // Required field
      field: "activity", // Maps to snake_case column name
    },
    assignedBy: {
      type: DataTypes.INTEGER, // VARCHAR(100) for email
      allowNull: true, // Required field
      references: {
        model: Assignor, // Assuming you have a 'Users' model
        key: "assignor_id", // Foreign key refers to the 'id' field in the 'Users' table
      },
      field: "assigned_by", // Maps to snake_case column name in the DB
    },
    remarks: {
      type: DataTypes.STRING(200), // VARCHAR(10) for gender
      allowNull: true, // Optional field
      field: "remarks", // Maps to snake_case column name
    },

    latitude: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "latitude",
    },
    longitude: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "longitude",
    },
    imageUrl: {
      type: DataTypes.TEXT, // TEXT for storing the ticket URL
      allowNull: true, // Required field
      field: "image_url", // Maps to snake_case column name
      defaultValue: "",
    },
  },
  {
    timestamps: true, // We are defining the `createdAt` field explicitly, so no need for automatic createdAt/updatedAt fields
    tableName: "assignments", // Custom table name (optional)
    underscored: true, // Converts camelCase to snake_case in the DB
  }
);

module.exports = Assignments;

const { Sequelize, DataTypes } = require("@sequelize/core");
const sequelize = require("../config/db"); // Your Sequelize instance

const Assignor = sequelize.define(
  "Assignor",
  {
    assignorId: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Auto-incrementing ID
      primaryKey: true,
      allowNull: false,
      field: "assignor_id", // Maps to snake_case column name in the DB
    },
    assignor: {
      type: DataTypes.STRING(100), // VARCHAR(100) for the category name
      allowNull: false, // This field cannot be null
      unique: true, // Ensure the category name is unique
      field: "assignor", // Maps to snake_case column name
    },
  },
  {
    timestamps: true, // We don't need createdAt/updatedAt for categories
    tableName: "assignors", // Custom table name (optional)
    underscored: true, // Ensures snake_case column names in the DB
  }
);

module.exports = Assignor;

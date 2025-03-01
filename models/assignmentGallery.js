const { Sequelize, DataTypes } = require("@sequelize/core");
const sequelize = require("../config/db");
const Assignment = require("./assignments");

const AssignmentGallery = sequelize.define(
  "AssignmentGallery",
  {
    galleryId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      field: "gallery_id",
    },
    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Assignment, // Ensure Event is imported correctly
        key: "assignment_id", // The foreign key in the Event model
      },
      field: "assignment_id",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "image_url",
    },
  },
  {
    timestamps: true, // As it's for the gallery, no timestamps like createdAt/updatedAt are needed
    tableName: "assignment_gallery",
    underscored: true,
  }
);
AssignmentGallery.belongsTo(Assignment, { foreignKey: "assignmentId" });
module.exports = AssignmentGallery;

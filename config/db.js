// const { Sequelize } = require("sequelize");
const { dbConfig } = require("./config");
const { PostgresDialect } = require("@sequelize/postgres");
const { Sequelize } = require("@sequelize/core");
const fs = require("fs");

// Read the certificate
const certificate = fs.readFileSync("./ca.pem");
const sequelize = new Sequelize({
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password,
  port: dbConfig.dbPort,
  ssl: {
    rejectUnauthorized: true,
    ca: certificate.toString(),
  },
  clientMinMessages: "notice",
  host: dbConfig.host,
  dialect: PostgresDialect,
  logging: console.log,
});

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

module.exports = sequelize;

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Sequelize instance with environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,       // Database name from .env file
  process.env.DB_USER,       // Database user from .env file
  process.env.DB_PASSWORD,   // Database password from .env file
  {
    host: process.env.DB_HOST,  // Database host from .env file
    dialect: 'mysql',           // MySQL dialect
    logging: false,             // Disable SQL logging (optional)
  }
);

// Test the database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1); // Exit the process with a failure code if connection fails
  }
};

module.exports = { sequelize, DataTypes, connectDB };

const { sequelize, DataTypes } = require('../config/db.js');

// Define the Client model with id, name, email, and phone
const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Automatically increment the ID
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,  // Ensure that 'name' is provided
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,  // Ensure that 'email' is provided
    unique: true,      // Ensure that 'email' is unique
    validate: {
      isEmail: true,   // Validate that the email is in correct format
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,  // Ensure that 'phone' is provided
    unique: true,      // Ensure that 'phone' is unique
    validate: {
      is: /^[0-9]+$/,   // Ensure the phone number only contains digits
    },
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,  // Set default value for 'completed'
  },
});

// Sync the model with the database (create table if it doesn't exist)
const syncClientTable = async () => {
  try {
    await sequelize.sync(); // This will create the table if it doesn't exist
    console.log("Client table created or already exists.");
  } catch (error) {
    console.error("Error syncing Client table:", error);
  }
};

module.exports = { Client, syncClientTable };

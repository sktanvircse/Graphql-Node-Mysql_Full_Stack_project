const { sequelize, DataTypes } = require('../config/db.js');
const { Client } = require('./clients.js'); // Import Client model

// Define the Project model with id, name, description, status, and clientId
const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Automatically increment the ID
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,  // Ensure that 'name' is provided
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,  // Ensure that 'description' is provided
  },
  status: {
    type: DataTypes.ENUM,
    values: ['Not_Started', 'In_Progress', 'Completed'],  // Three possible statuses
    defaultValue: 'Not_Started',  // Default value
  },
  clientId: {
    type: DataTypes.INTEGER,
    references: {
      model: Client,      // Reference the Client model
      key: 'id',          // The foreign key points to the `id` of the Client model
    },
    allowNull: false,      // Ensure that 'clientId' is provided
  },
});

// Define the relationship between Project and Client
Project.belongsTo(Client, { foreignKey: 'clientId' });

// Sync the model with the database (create table if it doesn't exist)
const syncProjectTable = async () => {
  try {
    await sequelize.sync();  // This will create the table if it doesn't exist
    console.log("Project table created or already exists.");
  } catch (error) {
    console.error("Error syncing Project table:", error);
  }
};

module.exports = { Project, syncProjectTable };

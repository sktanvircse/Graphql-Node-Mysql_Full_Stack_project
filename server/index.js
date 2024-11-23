const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const colors = require('colors');
const schema = require('./schema/schema');
const { connectDB } = require('./config/db'); // Import connectDB from the config
const { syncClientTable } = require('./models/clients');
const { syncProjectTable } = require('./models/project');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());

//Create Table Client
// syncClientTable();

//Create Table Project
// syncProjectTable();

// Connect to the database
connectDB();  // Connect to MySQL using Sequelize

// Setup GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
}));

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`.green);
    console.log("Database connection established.".blue);  // Log when the DB connection is established
});

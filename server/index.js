const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();
const schema = require('./schema/schema')
const PORT = process.env.PORT || 5000;

const app = express();
// app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
}))




app.listen(PORT, () => {
    console.log("listen")
})

const express = require('express');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlresolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth');

const app = express();
const MONGODBURL = "<your mongodb cluster url goes here>";
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlresolvers,
    graphiql: true,
    formatError(error) {

        if(! error.originalError) {
            return error;
        }

        return {
            message: error.message || 'An error occurred.',
            status: error.originalError.code || 500,
            data: error.originalError.data 
        };
    }
}));

app.use((error, req, res, next) => {

    console.log(error);
    res.status(error.statusCode || 500).json({
        message: error.message,
        data: error.data
    });

});

mongoose.connect(MONGODBURL)
    .then(result => {        
        app.listen(3000);
    })
    .catch(error => {
        console.log(error);
    });

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
var sanitize = require('mongo-sanitize');

function cleanBody(req, res, next) {
    req.body = sanitize(req.body);
    next();
}
const app = express();

app.use(cors());
app.use(express.json());

mongoose.set('sanitizeFilter', true); // prevents noSQL injection
mongoose.connect(
    'mongodb+srv://junaid:123abc@cluster0.hcsm1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
);
mongoose.connection.once('open', () => {
    console.log('connected to database');
});

// var bodyParser = require('body-parser');
// app.use(express.static('frontend'));
// app.use(bodyParser.json());

app.use(
    '/api/graphql',
    requireAuth,
    cleanBody,
    graphqlHTTP({
        schema: schema,
        graphiql: true,
        customFormatErrorFn: (err) => {
            const formattedError = {
                ...err,
                extensions: {
                    ...err.extensions,
                    status: err.extensions.status ?? 500,
                },
            };
            const message = {
                ...err,
                ...err.extensions,
                status: err.extensions.status ?? 500,
            };
            delete message.extensions;
            return {
                ...formattedError,
                message: JSON.stringify(message),
            };
        },
    })
);

app.use('/api/auth', authRoutes);

const http = require('http');
const PORT = 4000;

app.listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log('HTTP server on http://localhost:%s', PORT);
});

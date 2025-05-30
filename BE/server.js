require('dotenv').config(); 
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const httpErrors = require("http-errors");
const bodyParser = require("body-parser");
const db = require("./config/db");
const session = require('express-session');


const app = express();


app.use(session({ 
    secret: process.env.JWT_SECRET || 'HaoNQHE161800SecretKey041', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors({
    origin: '*', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));



app.get('/', (req, res) => {
    res.status(200).json({
        message: "oke"
    });
});



app.use(async (req, res, next) => {
    next(httpErrors.NotFound());
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});


db.connectDB(); 
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("../src/db/mongoose"); //this ensures mongoos runs and connect to our database

const secrets = require("../src/secrets");
const app = express();
const userRouter = require("../src/router/users");

app.use('/', require('../src/router/users'));
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(userRouter);

app.listen(secrets.PORT, () => {
    console.log("Server is up and working");
});
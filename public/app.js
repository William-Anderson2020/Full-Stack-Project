const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("../src/db/mongoose"); //this ensures mongoos runs and connect to our database
const secrets = require("../src/secrets");
const app = express();

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Routes
app.use('/', require('../src/router/index'));
app.use('/users', require('../src/router/users'));


/* 
app.use(express.json());
 */

app.listen(secrets.PORT, () => {
    console.log("Server is up and working");
});
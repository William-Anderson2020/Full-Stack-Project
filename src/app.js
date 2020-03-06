const express = require("express");
const path = require('path');
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("./db/mongoose"); //this ensures mongoos runs and connect to our database
const secrets = require("./secrets");
const app = express();

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))
//Routes
app.use('/', require('./router/index'));
app.use('/users', require('./router/users'));
//css
app.use(express.static(__dirname + '/public'));

/* 
app.use(express.json());
 */

app.listen(secrets.PORT, () => {
    console.log("Server is up and working");
});
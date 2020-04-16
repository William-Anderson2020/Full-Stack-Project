const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("./db/mongoose"); //this ensures mongoos runs and connect to our database
const passport = require('passport');
const secrets = require("./secrets");
const app = express();
const flash = require('connect-flash');
const session = require('express-session');

// Passport Config
require('./config/passport')(passport);

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
// Express body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Epress Session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/', require('./router/index.js'));
app.use('/users', require('./router/users.js'));
//css
app.use(express.static(__dirname + '/public'));

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));



app.listen(secrets.PORT, () => {
    console.log("Server is up and working");
});
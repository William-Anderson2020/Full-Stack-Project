//Initialize process variables.
if(process.env.NODE_ENV !== 'production'){
  require("dotenv").config();
}

//Import required packages.
const path = require("path");
const hbs = require("hbs");
const express = require("express");
const app = express();
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const moment = require("moment")();
const passport = require("passport");
require("../src/db/mongoose");

//Set path variables.
const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const partialsPath = path.join(__dirname, "../templates/partials");
const viewsPath = path.join(__dirname, "../templates/views");
const characterRouter = require("../src/routers/character")
const itemRouter = require("../src/routers/item");
const userRouter = require("../src/routers/user");
const User = require("../src/models/user");

//Initialize Passport
const initializePassport = require("../src/config/passport");
initializePassport(passport);

//Setup handlebars engine and views location.
app.set("view engine", "hbs");
app.set("views", viewsPath); //telling express to get templates from templates/views folder
hbs.registerPartials(partialsPath);

//Declare middleware.
app.use(express.urlencoded({extended: false}));
app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(characterRouter);
app.use(itemRouter);
app.use(userRouter);
app.use(express.static('uploads'));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

const server = app.listen(PORT, () => { //Set server to run on assigned port.
  console.log(`Listening on port ${PORT}`);
});

//Initialize socket.io as well as namespaces for seperation of concerns.
const io = require("socket.io").listen(server);
const serverIndex = io.of("/serverIndex");
const mapIO = io.of("/map");

function checkAuthenticated(req, res, next){ //Middleware to determine if user is logged in. If not, redirect to  log in page.
  if(req.isAuthenticated()){
    return(next())
  } else {
    return res.redirect("/login");
  }
}

function checkNotAuthenticated(req, res, next){ //Middleware to determine if user is logged in. If so, redirect to home page.
  if(req.isAuthenticated()){
    return res.redirect("/")
  } else {
    return(next())
  }
}

app.get("/", checkAuthenticated, async (req, res) => { //Index page
  try {
    res.render("index", {
      name: req.user.name
    });
  } catch {
    res.status(500).send();
  }
});

app.get("/login", checkNotAuthenticated, (req,res) => { //Log in page
  res.render("login")
});

app.get("/register", checkNotAuthenticated, (req,res) => { //Sign up page
  res.render("register")
});

app.post("/login", checkNotAuthenticated, passport.authenticate('local', { //Post log in route, authenticates with passport.
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

app.get("/auth/google", checkNotAuthenticated, passport.authenticate("google", { scope: ["email"] })); //Redirect to google for sign in.

app.get("/auth/google/callback", checkNotAuthenticated, passport.authenticate("google", {failureRedirect: "/login"}), (req, res) => { //Return sign in from google.
  res.redirect("/");
});

/* app.get("/auth/steam", checkNotAuthenticated, passport.authenticate("steam")); //Log in with steam. Currently doesn't work.

app.get("/auth/steam/callback", checkNotAuthenticated, passport.authenticate("steam", {failureRedirect: "/login"}), (req, res) => {
  res.redirect("/");
}); */

app.post("/register", async (req, res) => { //Post user registration, send new user data to db.
  try {
    const user = new User(req.body);
    await user.save();
    req.login(user, err => {if(err){return err}});
    res.redirect("/");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/logout", (req, res) => { //Process logout request.
  req.logOut();
  res.redirect("/login");
});

app.get("/serverIndex", checkAuthenticated, async (req, res) => { //Loads server index page.
  try {
    res.render("serverIndex")
  } catch (error) {
    res.status(500).send();
  };
});

app.get("/game/:id", checkAuthenticated, async(req, res) => { //Loads game board where id is the game's unique id.
  try {
    res.render("map", { //Passes in userID for determining which user is currently on the page.
      userID: req.user.id
    });

  } catch (error) {
    res.status(500).send();
  }
});

let serverList = [];

serverIndex.on("connection", socket => { //Server index socket events.
  serverIndex.to(socket.id).emit("listRelay", {list: serverList}); //Sends server list to user.

  socket.on("serverCreation", data => { //Adds server to list on creation.
    serverList.push(data.id);
    serverIndex.emit("listRelay", {list: serverList});
  });

});

mapIO.on("connection", socket => { //Game board socket events.

  socket.on("joinRoom", data => { //Runs on joining game.
    socket.join(data.room, function(){ //Add user to socket room for the game. Determined by page url. Run subsequent calls for assigning user number and retrieving other users in game.
      if(io.nsps["/map"].adapter.rooms[data.room].length <= 2){
        console.log(`${socket.id} joined room ${Object.keys(socket.rooms)}`);
        mapIO.to(socket.id).emit("userNum", {num: io.nsps["/map"].adapter.rooms[data.room].length}); 
        socket.to(data.room).emit("sendU"); 

      }else{ //If room is full, return to server index.
        socket.leave(data.room, function(){
          mapIO.to(socket.id).emit("roomFull");  
        });
      };
    });
  });

  socket.on("userRelay", data => { //Relay user data to game room.
    mapIO.to(data.room).emit("recieveU", data);
  })

  socket.on("p1Req", () => { //Process player 1 request for user data.
    socket.broadcast.emit("p1ReqF");
  })

  socket.on("turnPass", data => { //Relay turn pass function.
    mapIO.to(data.room).emit("newTurn", {pass: data.pass});
  });

  socket.on("unitDefeated", data =>{ //Relay unit death function.
    mapIO.to(data.room).emit("unitDefeatedRelay", {x: data.x, y: data.y});
  })

  console.log(`A user connected @ ${moment.format('h:mm:ss a')} from ${socket.conn.remoteAddress}. (ID: ${socket.id})`);
  mapIO.to(socket.id).emit("cT", {msg: "success"}); //On connection run connection function.

  socket.on("boardUpdate", unitData => { //Relay unit data for movement and attack functions.
    let room = unitData.room;
    socket.to(room).emit("rT", unitData);
  });
});
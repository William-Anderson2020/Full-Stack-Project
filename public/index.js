if(process.env.NODE_ENV !== 'production'){
  require("dotenv").config();
}

const path = require("path");
const hbs = require("hbs");
const express = require("express");
const app = express();
//const http = require("http").Server(app);
//const bcrypt = require("bcryptjs");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const moment = require("moment")();
require("../src/db/mongoose");

const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const partialsPath = path.join(__dirname, "../templates/partials");
const viewsPath = path.join(__dirname, "../templates/views");
const characterRouter = require("../src/routers/character")
const itemRouter = require("../src/routers/item");
const userRouter = require("../src/routers/user");
const User = require("../src/models/user");
const passport = require("passport");
const initializePassport = require("../src/config/passport");
initializePassport(passport);
//setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath); //telling express to get templates from templates/views folder
hbs.registerPartials(partialsPath);
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

const server = app.listen(PORT, () => { //doesnt work with socket, http doesnt work with express
  console.log(`Listening on port ${PORT}`);
});

/* const server = app.listen(app.get("port"), () => {
  console.log(`Listening on port ${app.get("port")}`);
}) */

const io = require("socket.io").listen(server);
const serverIndex = io.of("/serverIndex");
const mapIO = io.of("/map");

function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return(next())
  } else {
    return res.redirect("/login");
  }
}

function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect("/")
  } else {
    return(next())
  }
}

app.get("/", checkAuthenticated, async (req, res) => {
  try {
    res.render("index", {
      name: req.user.name
    });
    console.log(res.user);
  } catch {
    res.status(500).send();
  }
});

app.get("/login", checkNotAuthenticated, (req,res) => {
  res.render("login")
});

app.get("/register", checkNotAuthenticated, (req,res) => {
  res.render("register")
});

app.post("/login", checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

app.get("/auth/google", checkNotAuthenticated, passport.authenticate("google", { scope: ["email"] }))

app.get("/auth/google/callback", checkNotAuthenticated, passport.authenticate("google", {failureRedirect: "/login"}), (req, res) => {
  res.redirect("/");
});

app.get("/auth/steam", passport.authenticate("steam"));

app.get("/auth/steam/return", passport.authenticate("steam", {failureRedirect: "/login"}), (req, res) => {
  res.redirect("/");
})

app.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.redirect("/login");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

app.get("/serverIndex", checkAuthenticated, async (req, res) => {
  try {
    res.render("serverIndex")
  } catch (error) {
    res.status(500).send();
  }

  /* io.on("connection", socket => {
    let openGames = [];
    io.to(socket.id).emit("serverLogRelay", )
    socket.on("serverCreation", data => {
      openGames.push(data.id);
    });
  }) */

});

app.get("/game/:id", checkAuthenticated, async(req, res) => {
  try {
    res.render("map");

  } catch (error) {
    res.status(500).send();
  }
});

let serverList = [];
serverIndex.on("connection", socket => {
  serverIndex.to(socket.id).emit("listRelay", {list: serverList});

  socket.on("serverCreation", data => {
    serverList.push(data.id);
    serverIndex.emit("listRelay", {list: serverList});
  });

});

mapIO.on("connection", socket => {

  socket.on("joinRoom", data => {
    socket.join(data.room, function(){
      console.log(`${socket.id} joined room ${Object.keys(socket.rooms)}`);
      mapIO.to(socket.id).emit("userNum", {num: io.nsps["/map"].adapter.rooms[data.room].length});
    });
  });

  socket.on("turnPass", data => {
    mapIO.to(data.room).emit("newTurn", {pass: data.pass});
  });

  socket.on("unitDefeated", data =>{
    mapIO.to(data.room).emit("unitDefeatedRelay", {x: data.x, y: data.y});
  })

  console.log(`A user connected @ ${moment.format('h:mm:ss a')} from ${socket.conn.remoteAddress}. (ID: ${socket.id})`);
  mapIO.to(socket.id).emit("cT", {msg: "success"});

  socket.on("boardUpdate", unitData => {
    console.log("data recieved");
    let room = unitData.room;
    socket.to(room).emit("rT", unitData);
    console.log("data sent");
  });

});
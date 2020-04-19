const path = require("path");
const hbs = require("hbs");
const express = require("express");
const app = express();
//const http = require("http").Server(app);

const moment = require("moment")();
require("./db/mongoose");


const publicDirectoryPath = path.join(__dirname, "../public");
const partialsPath = path.join(__dirname, "../templates/partials");
const viewsPath = path.join(__dirname, "../templates/views");
const characterRouter = require("./routers/character")
const itemRouter = require("./routers/item")

//setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath); //telling express to get templates from templates/views folder
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(characterRouter);
app.use(itemRouter);
app.use(express.static('uploads'));

const server = app.listen(3000, () => { //doesnt work with socket, http doesnt work with express
  console.log("Listening on port 3000");
});

/* const server = app.listen(app.get("port"), () => {
  console.log(`Listening on port ${app.get("port")}`);
}) */

const io = require("socket.io").listen(server);
const serverIndex = io.of("/serverIndex");
const mapIO = io.of("/map");

app.get("", async (req, res) => {
  try {
    res.render("map", {
      title: "Board Logic"
    });
  } catch {
    res.status(500).send();
  }
});

app.get("/serverIndex", async (req, res) => {
  try {
    res.render("index")
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

app.get("/game/:id", async(req, res) => {
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
    });
  });

  console.log(`A user connected @ ${moment.format('h:mm:ss a')} from ${socket.conn.remoteAddress}. (ID: ${socket.id})`);
  mapIO.to(socket.id).emit("cT", {msg: "success"});

  socket.on("boardUpdate", unitData => {
    console.log("data recieved");
    let room = unitData.room;
    socket.to(room).emit("rT", unitData);
    console.log("data sent");
  });

});
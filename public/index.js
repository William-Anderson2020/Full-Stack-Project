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

const io = require("socket.io")(server);

app.get("", async (req, res) => {
  try {
    res.render("map", {
      title: "Board Logic"
    });
  } catch {
    res.status(500).send();
  }
});

app.get("/api/unit/:id", async (req, res) => {
  try{
    let data = await fetch(`/characters/${req.params.id}`);
    data = await data.json();
    console.log("TEST");
    res.send(data);
  }catch{
    res.status(500).send();
  }
});

io.on("connection", socket => {
  console.log(`A user connected @ ${moment.format('h:mm:ss a')} from ${socket.conn.remoteAddress}. (ID: ${socket.id})`);
  io.to(socket.id).emit("cT", {msg: "success"});

  socket.on("boardUpdate", unitData => {
    console.log("data recieved");
    io.emit("rT", unitData);
    console.log("data sent");
  });

});
const path = require("path");
const hbs = require("hbs");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
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
app.use(characterRouter)
app.use(itemRouter)

http.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.get("", async (req, res) => {
  try {
    res.render("map", {
      title: "Board Logic"
    });
  } catch {
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
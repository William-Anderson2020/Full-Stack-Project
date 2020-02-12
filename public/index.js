/*
const path = require("path");
const hbs = require("hbs");
const express = require("express");
const app = express();


const publicDirectoryPath = path.join(__dirname, "../public");
const partialsPath = path.join(__dirname, "../templates/partials");
const viewsPath = path.join(__dirname, "../templates/views");

//setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath); //telling express to get templates from templates/views folder
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));
app.get("", async (req, res) => {
  try {
    res.render("index", {
      title: "Our First Express App"
    });
  } catch {
    res.status(500).send();
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

*/
const express = require("express");
require("./db/mongoose");
const app = express();
const characterRouter = require("./routers/character")
app.use(express.json());

app.listen(3000, ()=>{
    console.log("3000");
})
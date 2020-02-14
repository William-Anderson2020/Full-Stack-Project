const express = require("express");
require("./db/mongoose");
const app = express();
const characterRouter = require("./routers/character")
const itemRouter = require("./routers/item")
app.use(express.json());
app.use(characterRouter)
app.use(itemRouter)

app.listen(3000, ()=>{
    console.log("3000");
})
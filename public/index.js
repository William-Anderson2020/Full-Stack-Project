const express = require("express");
require("../src/db/mongoose"); //this ensures mongoos runs and connect to our database
const app = express();
const userRouter = require("./routers/users");

app.use(express.json());
app.use(userRouter);

app.listen(process.env.PORT, () => {
    console.log("Server is up and working");
});
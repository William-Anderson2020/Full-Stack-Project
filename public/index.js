const express = require("express");
require("../src/db/mongoose"); //this ensures mongoos runs and connect to our database
const secrets = require("../src/secrets");
const app = express();
const userRouter = require("../src/router/users");

app.use(express.json());
app.use(userRouter);

app.listen(secrets.PORT, () => {
    console.log("Server is up and working");
});
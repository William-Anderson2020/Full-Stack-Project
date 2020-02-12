const mongoose = require('mongoose');
const MONGODB_URL = require("../secrets")
mongoose.connect(MONGODB_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    });
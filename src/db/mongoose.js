const mongoose = require('mongoose');
const secrets = require("../secrets")
mongoose.connect(secrets.MONGODB_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    });
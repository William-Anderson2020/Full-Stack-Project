const mongoose = require('mongoose');
mongoose.connect(process.env.MONGDB_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    });
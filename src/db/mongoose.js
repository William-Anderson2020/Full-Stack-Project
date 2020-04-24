const mongoose = require("mongoose");
mongoose.connect(
    "mongodb+srv://admin:lwkws38483@full-stack-db-wbsq7.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology:true,
});
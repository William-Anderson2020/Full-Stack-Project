const mongoose = require("mongoose");

if(process.env.NODE_ENV !== 'production'){
    require("dotenv").config();
  }


mongoose.connect(
    `mongodb+srv://${process.env.DBID}:${process.env.DBPASS}@full-stack-db-wbsq7.mongodb.net/test?retryWrites=true&w=majority`,{
    useNewUrlParser:true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology:true,
});
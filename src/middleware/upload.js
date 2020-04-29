
const multer = require("multer");

const upload=multer({
    limits:{
        fileSize:2000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error("No Upload"));
        }cb(undefined,true)
    }
})

module.exports = upload;

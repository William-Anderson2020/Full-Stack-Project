const Character = require("../models/character");
const admin = async(req,res,next)=>{
    try {
        if(req.User.admin=true){
            next()
        }
    } catch (error) {
        res.status(400).send("Not an Admin")
    }
}
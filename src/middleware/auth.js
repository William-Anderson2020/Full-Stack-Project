const User = require("../models/user");
const JWT_PASSWORD = require("../secrets");
const jwt = require("jsonwebtoken");


const auth = async (req, res, next) => {
    try {
       const token = req.header("Authorization").replace("Bearer ", ""); 
       const decoded = jwt.verify(token, JWT_PASSWORD);
       const user = await User.findOne({
           _id: decoded._id,
           "tokens.token": token       
        });
        if(!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user; //rout handler will not have to fetch user account
        next();
    } catch (error) {
        res.status(401).send({error: "Authorization Fail: please authenticate"});
    }
};
module.exports = auth;
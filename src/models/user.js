const mongoose = require("mongoose");
const secrets = require("../secrets");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    /* validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    } */
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    /* validate(value){
      if (value.toLowerCase().includes("password")){
        throw new Error('password cannot contain "password');
      }
    } */
  } /*,
   tokens: [
    {
      token: {
        type:String,
        required: true
      }
    }
  ],
  profilePic: {
    type: Buffer
  },
  score:[
    {
      winLosses: {
        type:Number
      },
      win: {
        type:Number
      },
      losses: {
        type:Number
      }
    }
  ],
  inventory: {
    type: Object
  }  */
});
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  /* delete userObject.tokens; */
  delete userObject.password;
  return userObject;
}
/* userSchema.methods.generateToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString()}, secrets.JWT_PASSWORD);
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
}; */

userSchema.pre("save", async function(next){
  const user = this;
  if (user.isModified("password")){
    user.password = await bcrypt.hash(user.password, 7);
  }
  next();
});
//when we send a pst or patch request, then bcrypt will run BEFORE the user password is saved to the mongo object.

userSchema.statics.findByCredentials = async (email, password) =>{
  const user = await User.findOne({ email });
  if(!user){
    throw new Error("unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch){
    throw new Error("incorrect password");
  }
  return user;
} 
const User = mongoose.model("User", userSchema);

module.exports = User;
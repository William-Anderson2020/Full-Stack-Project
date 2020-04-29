const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value){
            if(value.toLowerCase().includes(this.name.toLowerCase())){
                throw new Error("Password cannot contain username.");
            }
        }
    },
    units:{
        type:[{}],
        default:[{"id":"5ea9b1342cd7b97420ea0f1c", "item":""}, {"id":"5ea9ade22cd7b97420ea0f18", "item":""}, {"id":"5ea9b3082cd7b97420ea0f1e", "item":""}]
    },
    activeUnits:{
        type:[{}],
        default:[{"id":"5ea9b1342cd7b97420ea0f1c", "item":""}, {"id":"5ea9ade22cd7b97420ea0f18", "item":""}, {"id":"5ea9b3082cd7b97420ea0f1e", "item":""}]
    },
    currency:{
        type: Number,
        default: 0,
        required: true
    },
    profilePic: {
        type:Buffer
    }
}, {timestamps: true});

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    //console.log(user);
    if(!user){
        throw new Error("No user registered to that email.");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error("Incorrect password.");
    }
    return user;
}

const User = new mongoose.model("User", userSchema);

module.exports = User;
const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
    stats:{
        health:{
            type:Number,
            required:true
        },
        attack:{
            type:Number,
            required:true
        },
        defense:{
            type:Number,
            required:true
        },
        speed:{
            type:Number,
            required:true
        },
    },
    weapon:{
        type:String
    },
    name:{
        type:String,
        required:true
    },
    Sprite:{
        idle:{
            type:Buffer
        },
        attack:{
            type:Buffer
        }
    }
})


const Character = mongoose.model("Character", userSchema)
module.exports = Character;
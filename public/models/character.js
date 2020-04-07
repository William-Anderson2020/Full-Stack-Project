const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
    stats:{
        health:{
            type:Number,
            required:true,
            min:0
        },
        attack:{
            type:Number,
            required:true, 
            min:0
        },
        defense:{
            type:Number,
            required:true,
            min:0
        },
        speed:{
            type:Number,
            required:true,
            min:0
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


const Character = mongoose.model("Character", characterSchema)
module.exports = Character;
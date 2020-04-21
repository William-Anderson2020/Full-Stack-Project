const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    hp:{
            type:Number,
            required:true,
            min:0
    },
    weapon:{
        type:String,
        required:true
    },
    stats:{
        atk:{
            type:Number,
            required:true, 
            min:0
        },
        def:{
            type:Number,
            required:true,
            min:0
        },
        res:{
            type:Number,
            required:true,
            min:0
        },
        spd:{
            type:Number,
            required:true,
            min:0
        },
        mvt:{
            type:Number,
            required:true,
            min:0
        },
        rng:{
            type:Number,
            required:true,
            min:0
        },
        lck:{
            type:Number,
            required:true,
            min:0
        },
        dex:{
            type:Number,
            required:true,
            min:0
        },
    },
    item:{
        type:String
    },
    sprite:{
        idle:{
            type:Buffer
        },
        attack:{
            type:Buffer
        }
    }
})


const Character = mongoose.model("Unit", characterSchema)
module.exports = Character;
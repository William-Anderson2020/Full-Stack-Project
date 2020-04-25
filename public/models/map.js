const mongoose = require("mongoose");

const mapSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    tiles:{
            type:Array,
            required:true,
            min:0
    },
    size:{
    \\idk
        type:String,
        required:true
    },
   }
  )
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


const Map = mongoose.model("Map", mapSchema)
module.exports = Map;

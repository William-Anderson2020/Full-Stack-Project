const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
        },
        stats:{
            health:{
                type:Number,
                required:true,
            },
            attack:{
                type:Number,
                required:true,
            },
            defense:{
                type:Number,
                required:true,
            },
            speed:{
                type:Number,
                required:true,
            },
        },
        image:{
            type:Buffer,
            default:None
        }
    }
)



const Item = mongoose.model("Character", itemSchema)
module.exports = Item;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    units:{
        type: Array,
        default: [],
        required: true
    },
    currency:{
        type: Number,
        default: 0,
        required: true
    },
});
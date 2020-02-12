const express = require("express");
const User = require("../models/character");
const router = new express.Router();

router.post("characters", async(req,res)=>{
    try {
        const character = new Character(req.character.body)
        await character.save();
        res.send(character)
    } catch (error) {
        
    }
})

router.get("/characters", async(req,res)=>{
    try{
        let character = await Character.find(req.body);
        res.send(character)
    }catch(error){
        res.status(501).send(error)
    }
})
 
module.exports= router
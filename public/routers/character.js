const express = require("express");
const Character = require("../models/character");
const router = new express.Router();

router.post("/characters", async(req,res)=>{
    try {
        const unit = new Character(req.body);
        await unit.save();
        res.send(unit)
    } catch (error) {
     res.status(501).send(error)   
    }
})

router.get("/characters/:id", async(req,res)=>{
    try{
        let unit = await Character.find(req.params.id);
        res.send(unit);
    }catch(error){
        res.status(501).send(error)
    }
})
 
module.exports= router
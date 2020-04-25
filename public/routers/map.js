const express = require("express");
const Map = require("../models/map");
const upload = require("../middleware/upload");
const router = new express.Router();

router.post("/maps", async(req,res)=>{
    try {
        const map = new Map(req.body)
        await map.save();
        res.send(map)
    } catch (error) {
     res.status(501).send(error)   
    }
})

router.get("/maps", async(req,res)=>{
    try{
        let map = await Map.find(req.body);
        res.send(map)
    }catch(error){
        res.status(501).send(error)
    }
})


module.exports= router;

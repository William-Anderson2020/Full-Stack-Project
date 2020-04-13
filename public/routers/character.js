const express = require("express");
const Character = require("../models/character");
const upload = require("../middleware/upload");
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
        let unit = await Character.findById(req.params.id);
        res.send(unit);
    }catch(error){
        res.status(501).send(error)
    }
});

router.post("/characters/image/idle/:id", upload.single("image"), async(req,res)=>{
        try {
            let unit = await Character.findById(req.params.id);
            unit.sprite.idle = req.file.buffer;
            await unit.save();
            res.send(unit);
        } catch (error) {
            res.status(501).send(error);
        };
    }
);

router.post("/characters/image/attack/:id", upload.single("image"), async(req,res)=>{
    try {
        let unit = await Character.findById(req.params.id);
        unit.sprite.attack = req.file.buffer;
        await unit.save();
        res.send(unit);
    } catch (error) {
        res.status(501).send(error);
    };
}
);
 
module.exports= router
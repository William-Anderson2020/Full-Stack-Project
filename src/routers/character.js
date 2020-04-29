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

router.post("/characters/image/post/:type/:id", upload.single("image"), async(req,res)=>{
    try {
        let unit = await Character.findById(req.params.id);
        unit.sprite[req.params.type] = req.file.buffer;
        await unit.save();
        if(req.params.type == "attack"){
            res.set('Content-Type', 'image/gif');
        }else{
            res.set('Content-Type', 'image/png');
        }
        res.send(unit.sprite[req.params.type]);
    } catch (error) {
        res.status(501).send(error);
    };
});

router.get('/characters/image/:type/:id', async (req, res) => {
    try {
        const unit = await Character.findById(req.params.id);
        if(!unit || !unit.sprite[req.params.type]){
            throw new Error('Sprite not found.');
        } else{
            if(req.params.type == "attack"){
                res.set('Content-Type', 'image/gif');
            }else{
                res.set('Content-Type', 'image/png');
            }
            res.send(unit.sprite[req.params.type]);
        }
    } catch (error) {
        res.status(500).send(error)
    }
});
 
module.exports= router
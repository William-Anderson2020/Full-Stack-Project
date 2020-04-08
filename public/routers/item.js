const express = require("express");
const Item = require("../models/item");
const upload = require("../middleware/upload");
const router = new express.Router();

router.post("/items", async(req,res)=>{
    try {
        const item = new Item(req.body)
        await item.save();
        res.send(item)
    } catch (error) {
     res.status(501).send(error)   
    }
})

router.get("/items", async(req,res)=>{
    try{
        let item = await Item.find(req.body);
        res.send(item)
    }catch(error){
        res.status(501).send(error)
    }
})



router.post("/item/image",
    upload.single("image"),
    async(req,res)=>{
        try {
            req.item.image = req.file.buffer;
            await res.item.save()
            res.send("Uploaded")
        } catch (error) {
            
        }
    }

)
module.exports= router

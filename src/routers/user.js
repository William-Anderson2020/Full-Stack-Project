const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = new express.Router();


router.post("/users/login", async (req, res) => {
    try {
        if(req.body.email.includes('@') != true){
            res.status(400).json({err: 'Input a valid email.'});
        } else{
            const user = new User(req.body);
            await user.save();
            const token = await user.generateToken();
            res.send({user, token});
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

router.get("/users/find", async (req, res) => {
    try{
        let user = await User.find(req.body);
        res.send(user);
    }catch(err){
        res.status(500).send(err);
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})

router.get("/users/find/:id", async (req, res) => {
    try{
        let user = await User.findById(req.params.id);
        res.send(user);
    }catch(err){
        res.status(500).send(err);
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        let user = await User.findByIdAndDelete(req.params.id);
        res.send(user);
    } catch (err) {
        res.status(500).send(err)
    }
});

router.patch("/users/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body);
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(500).send(error);    
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateToken();
        res.send({user, token});
    } catch (error) {
        res.status(500).send(error)
    }
});

/* router.post('/users/logout', auth, async (req, res) => {
    //console.log(req.user.name);
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            console.log(token.token);
            return token.token !== req.token;
        });
        await req.user.save();
        res.send('Logout Complete.');
    } catch (error) {
        res.status(400).send(error);
    }
}); */

router.post('/users/me/profilePic', auth, upload.single('profilePic'), async (req, res) => {
    try {
        req.user.profilePic = req.file.buffer;
        await req.user.save();
        res.status(200).send('Uploaded Profile Picture Successfully.')
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users/:id/profilePic', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.profilePic){
            throw new Error('Profile picture not found.');
        } else{
            res.set('Content-Type', 'image/jpg');
            res.send(user.profilePic)
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

/* router.get('/users/me/profilePic', auth, async (req, res) => {
    try {
        if(!req.user || !req.user.profilePic){
            throw new Error('Profile picture not found.');
        } else{
            res.set('Content-Type', 'image/jpg');
            res.send(req.user.profilePic);
        }
    } catch (error) {
        res.status(500).send(error)
    }
}) */

module.exports = router;
const express = require("express");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const auth = require("../middleware/auth");
const passport = require('passport');
const upload = require("../middleware/upload");
const router = new express.Router();

//Login Page
router.get('/login', (req, res) => res.render('login'));
//Register Page
router.get('/register', (req, res) => res.render('register'));
//Register
/* router.post('/register', (req, res) => {
    const { name, email, password} = req.body;
    let errors = [];
  
    if (!name || !email || !password) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('register', {
            errors,
            name,
            email,
            password
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
  
          bcrypt.genSalt(2, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  });
 */
//Login
 /* router.post('/login',auth, (req,res) => {
   console.log(req.body);
   res.redirect("/dashboard");
});  */

router.post("/register", async (req, res) => {
    try{
        const user = new User(req.body);
        await user.save();
        /* const token = await user.generateToken(); */ //lowercase so that token is generated for only this user
        /* res.send({user, token}); */
        req.flash(
            'success_msg',
            'You are now registered and can log in'
          );
        res.redirect('/users/login');
    }catch (error){
        res.status(500).send(error);
    }
});
// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/users/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });
/* router.post("/login", async (req, res) =>{
try {
    const user = await User.findByCredentials(
        req.body.email,
        req.body.password
    );
    const token = await user.generateToken();
   
    res.send({user, token});
    res.redirect("/users/dashboard");
} catch (error) {
    res.status(500).send(error);
}
}); */

//logout
/* router.post("/users/logout", auth, async(req,res) =>{
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            console.log(token.token);
            return token.token !== req.token;
        });
        await req.user.save();
        res.send("You have logged out");
    } catch (error) {
        res.status(500).send(error);
    }
}); */
/*router.get("/users", async (req, res) => {
    try{
        let users = await User.find({});
        res.send(users);
    }catch (error){
        res.status(500).send(error);
    }
});
router.get("/users/me", auth, async(req, res) => {
    res.send(req.user);
});
router.get("/users/:id",  async (req, res) => {
    try {
      let user = await User.findById(req.params.id);
      res.send(user);  
    }catch (error) {
        res.status(500).send(error);
    }
});
router.delete("/users/:id", auth, async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch("/users/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["email", "name", "password"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update)
    );
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body);
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});
router.post("/users/me/profilePic",
    auth,
    upload.single("profilePic"),
    async(req, res) =>{
        try {
            req.user.profilePic = req.file.buffer;
            await req.user.save();
            res.send("Upload Successful");
        } catch (error) {
            res.send(error);
        }
    }
);
router.get("/user/:id/profilePic", async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user ||!user.profilePic) {
            throw new Error();
        }
        res.set("Content-Type", "image/jpg");
        res.send(user.profilePic);
    } catch (error) {
        res.status(404).send(error);
    }
})  */
module.exports = router;
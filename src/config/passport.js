const localStrategy = require("passport-local").Strategy
const googleStrategy = require("passport-google-oauth").OAuth2Strategy
const steamStrategy = require("passport-steam").Strategy
const bcrypt = require("bcryptjs");
const User = require("../models/user");

if(process.env.NODE_ENV !== 'production'){
    require("dotenv").config();
  }

function initialize(passport){
    const authenticateUser = async (email, password, done) => {
        const user = await User.findOne({email: email});
        if(user == null){
            return done(null, false, {message: "No user registered to that email."});
        };
        try {
            await bcrypt.compare(password, user.password, function(err, res){
                if(err){
                    res.send(err);
                }
                if(res){
                    return done(null, user)
                }else{
                    return done(null, false, {message: "Incorrect password."});
                }
            })
        } catch (error) {
            return done(error);
        }

    }

    async function findOrCreate(profile, done){
        User.findOne({
            "email":profile.emails[0].value
        }, async function(err, user){
            if(err){
                return done(err)
            };
            try {
                if(!user){
                    user = new User({
                        name:profile.displayName,
                        email:profile.emails[0].value,
                        password:profile.id
                    });
                    await user.save();
                    done(err, user);
                } else{
                    return done(err, user);
                };    
            } catch (error) {
                return done(error);
            }
        });    
    };

    passport.use(new localStrategy({usernameField: "email"}, authenticateUser));
    passport.use(new googleStrategy({
        clientID:process.env.GSCID, 
        clientSecret:process.env.GSCS, 
        callbackURL: "/auth/google/callback"}, 
        async function(accessToken, refreshToken, profile, done) {
            findOrCreate(profile, done);
        }
    ));
    passport.use(new steamStrategy({
            returnURL:"/auth/steam/callback",
            realm:"http://full-stack-game.herokuapp.com/",
            apiKey:process.env.STEAMKEY
        },
        async function(id, profile, done){
            User.findByOpenID({ openId: id }, async function (err, user) {
                console.log(user);
                done(err, user);
            })
        }
    ));
    passport.serializeUser((user, done) => {done(null, user.id)});
    passport.deserializeUser(async (id, done) => {
        return done(null, await User.findById(id));
    });
}

module.exports = initialize;
const localStrategy = require("passport-local").Strategy
const googleStrategy = require("passport-google-oauth20").Strategy
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
    passport.use(new localStrategy({usernameField: "email"}, authenticateUser));
    passport.use(new googleStrategy({clientID:process.env.GSCID, clientSecret:process.env.GSCS, callbackURL: "auth/google/callback"}, 
        function(accessToken, refreshToken, profile, cb) {
            User.findOrCreate({ googleId: profile.id }, function (err, user) {
                return cb(err, user);
            });
        }
    ));
    passport.serializeUser((user, done) => {done(null, user.id)});
    passport.deserializeUser(async (id, done) => {
        return done(null, await User.findById(id));
    });
}

module.exports = initialize;
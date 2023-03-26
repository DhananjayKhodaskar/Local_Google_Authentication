const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const {User} = require("../database");
const crypto = require('crypto');

passport.use(new GoogleStrategy({
    clientID:     '312563676331-o6dfb5icitucjmkvtt4uqmecgheu7jaq.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:8000/auth/google/callback",
    passReqToCallback   : true 
  },
  function(req, accessToken, refreshToken, profile, done){
    // return done(null, profile);
    console.log(profile.displayName);
    User.findOne({username:profile.emails[0].value}).exec(function(err,user){
        if(err){
            console.log("error in google strategy passport",err);
            return;
        }
        // console.log(profile);

        if(user){
            return done(null, profile);
        }
        else{
            User.create({
                displayName: profile.displayName,
                username: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            },function(err,user){

                if(err){
                    console.log("error in creating user google strategy passport",err);
                    return;
                }
                return done(null, profile);
            })
        }
    })
}));

passport.serializeUser((user,done)=>{
    done(null,user);
})
passport.deserializeUser(async (user, done) => {
    done(null, user);
    
});
 
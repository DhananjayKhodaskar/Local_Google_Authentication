const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../models/user')
const bcrypt = require('bcrypt');
// USING PASSPORT LOCAL STRATEGY
exports.initializingPassport = (passport)=>{
    passport.use (new LocalStrategy({
        passReqToCallback:true,
    },async(req,username,password,done)=>{
        try {
            
            const user = await User.findOne({username})
        
        if(!user ){
            return done(null,false,req.flash('error','User Not Found'));
        } 
        bcrypt.compare(password, user.password, function(err, result) {
            // result == true
            if(result == true){
                return done (null,user); 
            }else{
                if(user.password !== password)return done(null, false,req.flash('error','Incorrect Password'));
            }
           

            
        });
        

        } catch (error) {
            return done (error,false);
        }

    }))

    passport.serializeUser((user,done)=>{
        done(null,user.id);
    })

    passport.deserializeUser(async (id,done)=>{
        // done(null,user.id);
        try {
            const user = await User.findById(id);

            done(null,user);
        } catch (error) {
            done (error,false); 
        }
    })
}


exports.isAuthenticated = (req,res,next)=>{
    if(req.user) return next();
    console.log("not authenticated")
    res.redirect('/');
}
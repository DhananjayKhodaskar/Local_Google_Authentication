//this code is in new brach and not in master branch 
const express= require('express');
const app = express();
const flash = require('connect-flash');
const path = require('path');
const index_routes = require('./routes/index_routes');
const bcrypt = require('bcrypt');
const {connectMongoose} = require('./config/mongoose')
const ejs= require('ejs');
const { check } = require('express-validator/check');
const { validationResult } = require('express-validator/check');
const {User} = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { initializingPassport } = require('./config/passport-local-strategy');
const expressSession = require('express-session');
const { isAuthenticated } = require('./config/passport-local-strategy');
const { error } = require('console');
const googleOauth2 = require('./config/passport-google-oauth2-strategy');



//MIDDLEWARES
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(expressSession({
    secret:"secret",
    resave : false,
    saveUninitialized:false,
    cookie: { secure: false } 
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view-engine','ejs'); 


//CALLING THE FUNCTIONS
const startMongoose = connectMongoose();
const startingPassport = initializingPassport(passport);


//Google Auth
app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));
app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
      
        successRedirect: '/',
        failureRedirect: '/auth/google/failure'
}));

app.get('/auth/google/failure',(req,res)=>{
    res.send('Failure from Google sign in');
  })








//GET LOGOUT
app.get('/logout',async(req,res)=>{
    await req.logout(()=>{
     res.redirect('/');
    });   
 })
 

//GET POST CHANGEPASSWORD
app.get('/changepassword',isAuthenticated,(req,res)=>{
    res.render('changepassword.ejs',{user:req.user,errors:null}); 
})

app.post('/changepassword',isAuthenticated,async(req,res)=>{
    const newPassword =req.body.password;
    let username;
    
    if(!req.user.email){
        username=req.user.username;
    }else{
        username=req.user.email;
    }
    const user = await User.findOne({username:username})
    user.password=newPassword;
    user.save();
    res.redirect('/')
})


app.use(index_routes);


//APP LISTEN
app.listen(8000,()=>{
    console.log("server running on port 8000");
});


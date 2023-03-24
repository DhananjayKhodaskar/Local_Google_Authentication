const express= require('express');
const app = express();
const path = require('path');
const {connectMongoose} = require('./database')
const ejs= require('ejs');
const {User} = require('./database')
const passport = require('passport');
const { initializingPassport } = require('./passportConfig');
const expressSession = require('express-session');
const { isAuthenticated } = require('./passportConfig');
require('./googleAuthfine')


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
connectMongoose();
initializingPassport(passport);


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






app.post('/signup',async(req,res)=>{
    const user = await User.findOne({username:req.body.username})
    if(user)return res.status(400).send("User Already Exists");
 
    const newUser = await User.create(req.body);
    res.redirect('/login');
 })
 app.get('/login',(req,res)=>{
    res.render('login.ejs',{user:req.user});
})

app.get('/signup',(req,res)=>{
  
    res.render('signup.ejs',{user:req.user});
})

app.post('/login'
,passport.authenticate("local",
{failureRedirect:'/signup',
successRedirect:'/'
}),(req,res)=>{ 
    
}) 

app.get('/profile',isAuthenticated,(req,res)=>{
    res.send(req.user);
})
app.get('/logout',async(req,res)=>{
    await req.logout(()=>{
     res.redirect('/');
    });
     
 })
 app.get('/',(req,res)=>{
   
    res.render('index.ejs',{user:req.user}); 
    
})
app.listen(8000,()=>{
    console.log("server running on port 8000");
});
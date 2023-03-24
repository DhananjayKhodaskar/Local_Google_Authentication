const express= require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
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
    const displayName = req.body.displayName;
    const username = req.body.username;
    const password = req.body.password;
    let newpass= await bcrypt.hash(req.body.password,10);
    const newUser = new User({displayName,username,password});
    newUser.save();
    console.log(newUser);
    // await User.create({displayName,username,newpass});
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
//    console.log(req.user.email);


    res.render('index.ejs',{user:req.user}); 
    
})

app.get('/changepassword',isAuthenticated,(req,res)=>{
    res.render('changepassword.ejs',{user:req.user}); 
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


app.listen(8000,()=>{
    console.log("server running on port 8000");
});
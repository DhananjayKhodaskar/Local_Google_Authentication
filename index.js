//this code is in new brach and not in master branch 
const express= require('express');
const app = express();
const flash = require('connect-flash');
const path = require('path');
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

//GET AND POST SIGNUP
app.post('/signup',[check('username').isEmail().withMessage('please enter valid email'),
check('password','password length should be greater than 5 ').isLength({min:5}),
check('confirmPassword').custom((value,{req})=>{
    if(value != req.body.password){
        throw new Error('Password Have To Match');
    }
    return true
})]
,async(req,res)=>{
    const displayName = req.body.displayName;
    const username = req.body.username.toLowerCase();
    const password = req.body.password; 
    const user = await User.findOne({username:username})
    if(user)return res.status(400).render('signup.ejs',{user:req.user,errorMessage:"User Already Exists",oldInput:{displayName:req.body.displayName,username:req.body.username,password:req.body.password,confirmPassword:req.body.confirmPassword},validationErrors:[]}); 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('signup.ejs',
        {user:req.user,
        errorMessage:errors.array()[0].msg,
        oldInput:{displayName:req.body.displayName,username:req.body.username,password:req.body.password,confirmPassword:req.body.confirmPassword},
        validationErrors:errors.array()})
    }
    let newpass= await bcrypt.hash(req.body.password,10);
    const newUser = new User({displayName,username,password});
    newUser.save();
    console.log(newUser);
    // await User.create({displayName,username,newpass});
    res.redirect('/login');
 })

app.get('/signup',(req,res)=>{
  
    res.render('signup.ejs',{user:req.user,
        errorMessage:null,
        oldInput:{displayName:"",username:"",password:"",confirmPassword:""},validationErrors:[]}
        ); 
})

//GET AND POST LOGIN
app.get('/login',(req,res)=>{

    const errors = req.flash().error||[];
    res.render('login.ejs',{user:req.user,errors
    });
})

app.post('/login',passport.authenticate("local",{failureRedirect:'/login',successRedirect:'/',failureFlash: true}),
(req,res)=>{ 

}) 

//GET LOGOUT
app.get('/logout',async(req,res)=>{
    await req.logout(()=>{
     res.redirect('/');
    });   
 })
 app.get('/',(req,res)=>{

    res.render('index.ejs',{user:req.user});   
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

//APP LISTEN
app.listen(8000,()=>{
    console.log("server running on port 8000");
});


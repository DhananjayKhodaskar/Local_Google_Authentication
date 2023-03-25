const express= require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const {connectMongoose} = require('./database')
const ejs= require('ejs');
const { check } = require('express-validator/check');
const { validationResult } = require('express-validator/check');
const nodemailer = require('nodemailer');
const sendgridtransport = require('nodemailer-sendgrid-transport');
const {User} = require('./database')
const passport = require('passport');
const apiKeyMail='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';
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

const transporter = nodemailer.createTransport(sendgridtransport({
    auth:{
        api_key:apiKeyMail
    }
}))
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






app.post('/signup',
[check('username').isEmail().withMessage('please enter valid email'),
check('password','password length should be greater than 5 ').isLength({min:5}),
check('confirmPassword').custom((value,{req})=>{
    if(value != req.body.password){
        throw new Error('password have to match');
    }
    return true
})]
,async(req,res)=>{
    const user = await User.findOne({username:req.body.username})
    if(user)return res.status(400).render('signup.ejs',{user:req.user,errorMessage:"user exists",oldInput:{displayName:req.body.displayName,username:req.body.username,password:req.body.password,confirmPassword:req.body.confirmPassword},validationErrors:[]});
    const displayName = req.body.displayName;
    const username = req.body.username;
    const password = req.body.password; 
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



 app.get('/login',(req,res)=>{
    res.render('login.ejs',{user:req.user});
})

app.get('/forgotpassword',(req,res)=>{
    res.render('forgotpassword.ejs',{user:req.user});
})

app.post('/forgotpassword',async(req,res)=>{
    var randomstring = Math.random().toString(36).slice(-8);
   
    const user = await User.findOne({username:req.body.username});
    if(!user)res.redirect('/signup');
    const email = user.username;
    // transporter.sendMail({
    //     to:email,
    //     from:'dkhodaskar35@gmail.com',
    //     subject:randomstring, 
    //     html:'<h1>Above is password</h1>'
    // })
    res.redirect('/');
    
})


app.get('/signup',(req,res)=>{
  
    res.render('signup.ejs',{user:req.user,
        errorMessage:null,
        oldInput:{displayName:"",username:"",password:"",confirmPassword:""},validationErrors:[]}
        ); 
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
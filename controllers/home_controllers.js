const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { initializingPassport } = require('../config/passport-local-strategy');
const { isAuthenticated } = require('../config/passport-local-strategy');
const googleOauth2 = require('../config/passport-google-oauth2-strategy');
const { check } = require('express-validator/check');
const { validationResult } = require('express-validator/check');
const {User} = require('../models/user');



module.exports.get_login = (req,res)=>{

    const errors = req.flash().error||[];
    res.render('login.ejs',{user:req.user,errors
    });
};


module.exports.post_signup = async(req,res)=>{
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
    const newUser = new User({displayName,username,password});
    newUser.save();
    console.log(newUser);
    res.redirect('/login');
};


module.exports.get_signup =(req,res)=>{
  
    res.render('signup.ejs',{user:req.user,
    errorMessage:null,
    oldInput:{displayName:"",username:"",password:"",confirmPassword:""},validationErrors:[]}
    ); 
};


module.exports.get_home_page =(req,res)=>{
    res.render('index.ejs',{user:req.user});   
};
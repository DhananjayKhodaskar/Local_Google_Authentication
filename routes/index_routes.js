const { Router } = require('express');
const homeController = require('../controllers/home_controllers');
const userController = require('../controllers/user_controller');
const router = Router();


const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { initializingPassport } = require('../config/passport-local-strategy');
const { isAuthenticated } = require('../config/passport-local-strategy');
const googleOauth2 = require('../config/passport-google-oauth2-strategy');
const { check } = require('express-validator/check');
const { validationResult } = require('express-validator/check');
const {User} = require('../models/user');


//GET AND POST LOGIN ROUTES
router.get('/login',(req,res)=>{

    const errors = req.flash().error||[];
    res.render('login.ejs',{user:req.user,errors
    });
});
router.post('/login',passport.authenticate("local",{failureRedirect:'/login',successRedirect:'/',failureFlash: true}),
(req,res)=>{ 

});


//HOME PAGE
router.get('/',(req,res)=>{

    res.render('index.ejs',{user:req.user});   
})




//GET AND POST SIGNUP
router.post('/signup',[check('username').isEmail().withMessage('please enter valid email'),
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
    const newUser = new User({displayName,username,password});
    newUser.save();
    console.log(newUser);
    res.redirect('/login');
 })

router.get('/signup',(req,res)=>{
  
    res.render('signup.ejs',{user:req.user,
        errorMessage:null,
        oldInput:{displayName:"",username:"",password:"",confirmPassword:""},validationErrors:[]}
        ); 
});


//GOOGLE AUTH ROUTES

router.get('/auth/google/failure',(req,res)=>{
    res.send('Failure from Google sign in');
});

router.get( '/auth/google/callback',
    passport.authenticate( 'google', {
      
        successRedirect: '/',
        failureRedirect: '/auth/google/failure'
}));

router.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));


module.exports = router;
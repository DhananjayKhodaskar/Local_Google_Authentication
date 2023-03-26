const { Router } = require('express');
const homeController = require('../controllers/home_controllers');
const userController = require('../controllers/user_controller');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { initializingPassport } = require('../config/passport-local-strategy');
const { isAuthenticated } = require('../config/passport-local-strategy');
const googleOauth2 = require('../config/passport-google-oauth2-strategy');

const router = Router();


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


module.exports = router;
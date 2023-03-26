const { Router } = require('express');
const homeController = require('../controllers/home_controllers');
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


//GET HOME PAGE ROUTE
router.get('/',homeController.get_home_page);

//GET AND POST SIGNUP ROUTES
router.post('/signup',[check('username').isEmail().withMessage('please enter valid email'),check('password','password length should be greater than 5 ').isLength({min:5}),check('confirmPassword').custom((value,{req})=>{if(value != req.body.password){throw new Error('Password Have To Match');}return true})],homeController.post_signup);          
router.get('/signup',homeController.get_signup);

//GET AND POST LOGIN ROUTES
router.get('/login',homeController.get_login);
router.post('/login',passport.authenticate("local",{failureRedirect:'/login',successRedirect:'/',failureFlash: true}));

//GOOGLE AUTH ROUTES
router.get( '/auth/google/callback',passport.authenticate( 'google', {successRedirect: '/',failureRedirect: '/login'}));
router.get('/auth/google',passport.authenticate('google', { scope:[ 'email', 'profile' ] }));

//EXPORTING THE ROUTER
module.exports = router;
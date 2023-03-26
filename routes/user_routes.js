const { Router } = require('express');
const homeController = require('../controllers/home_controllers');
const userController = require('../controllers/user_controller');
const router = Router();


const { isAuthenticated } = require('../config/passport-local-strategy');
const {User} = require('../models/user');

//GET POST CHANGEPASSWORD
router.get('/changepassword',isAuthenticated,(req,res)=>{
    res.render('changepassword.ejs',{user:req.user,errors:null}); 
})

router.post('/changepassword',isAuthenticated,async(req,res)=>{
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
});

router.get('/logout',async(req,res)=>{
    await req.logout(()=>{
     res.redirect('/');
    });   
 })



module.exports = router;
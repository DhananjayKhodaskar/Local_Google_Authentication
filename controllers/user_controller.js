
const { isAuthenticated } = require('../config/passport-local-strategy');
const {User} = require('../models/user');


module.exports.get_changePassword = (req,res)=>{
    res.render('changepassword.ejs',{user:req.user,errors:null}); 
};

module.exports.post_changePassword = async(req,res)=>{
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
};


module.exports.get_logout = async(req,res)=>{
    await req.logout(()=>{
     res.redirect('/');
    });   
};
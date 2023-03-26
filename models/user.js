const mongoose =require('mongoose');
const bcrypt = require('bcrypt');

//USER SCHEMA
const userSchema = new mongoose.Schema({
    displayName:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

userSchema.pre('save',async function(next){
    try {
      const salt =await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password,salt);
      this.password=hashedPassword;
      next();  
    } catch (error) {
        next(error);
    }
})

exports.User = mongoose.model("User",userSchema);
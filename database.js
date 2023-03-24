const mongoose =require('mongoose');
const bcrypt = require('bcrypt');
exports.connectMongoose =() =>{
    mongoose.connect('mongodb+srv://dhanunew:dhanunew@cluster0.s5l5uux.mongodb.net/?retryWrites=true&w=majority')
    .then(()=>{
        console.log(`connection successful `);
    })
    .catch((err)=>{
        console.log(`error connecting to database` , err);
    })
}

const userSchema = new mongoose.Schema({
    displayName:String,
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
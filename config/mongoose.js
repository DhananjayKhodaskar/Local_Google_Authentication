const mongoose =require('mongoose');
exports.connectMongoose =() =>{
    mongoose.connect('mongodb+srv://dhanunew:dhanunew@cluster0.s5l5uux.mongodb.net/?retryWrites=true&w=majority')
    .then(()=>{
        console.log(`connection successful `);
    })
    .catch((err)=>{
        console.log(`error connecting to database` , err);
    })
}

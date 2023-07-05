const mongoose = require("mongoose");
 
const dbConnect =()=>{
    try{
    mongoose.connect(process.env.MONGODB_URL);
    console.log("DB Connected");
    }catch(error){
        console.log(error);
    }
}

module.exports = dbConnect;
const {default:mongoose} = require("mongoose");
mongoose.set("strictQuery",true);
const dbConnect =() =>{
    try{
     const conn= mongoose.connect(process.env.MONGODB_URL);
     console.log('DB Connected');
    }catch (error){
      handerError(error);
    }
}

module.exports = dbConnect;
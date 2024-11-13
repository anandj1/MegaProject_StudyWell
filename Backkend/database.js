const mongoose = require("mongoose");
require("dotenv").config();

exports.connect =()=>{
    mongoose.connect(process.env.URL)
    .then(()=> console.log("Connection Success"))
    .catch((error)=>{
        console.log("DB error!");
        console.error(error)
    })


}

const mongoose = require("mongoose");

const Profile = new mongoose.Schema({

    gender:{
        type: String,
        
    },
    dateOfBirth:{
        type: String,
        
    },
    about:{
        type: String,
       
    },
    contactNumber:{
        type: String,
    },
   
    



});
module.exports = mongoose.model("Profile",Profile )
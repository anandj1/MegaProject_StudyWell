const mongoose = require("mongoose");

const Course = new mongoose.Schema({

   title:{
    type:String,
    required:true,
    trim: true
   },
   courseDesc:{
    type:String,
    required:true
   },
    
   instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    whatulearn:{
        type:String
    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    }],
    ratingANDreview:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingANDReview"

    },
    price:{
        type:Number,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    Category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    Tag:{
        type:[String],
        required:true
    },
    StudentsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }],

    instructions:{
        type:String,

    },
    status:{
        type: String,
        enum:["Draft","Published"]
    }
    

})
module.exports = mongoose.model("Course",Course )
const Category = require("../models/Category");
const { populate } = require("../models/RatingANDReview");

exports.createCategory =async(req,res)=>{

    try{

        const{name,description} = req.body;
        if(!name||!description){
            return res.json({
                success:false,
                message:"Please fill all the deatails"
            })
        }
        // create the entry in db
        const Categorydetails = await Category.create({
            name:name,
            description:description
        })
        console.log(Categorydetails)
        return res.status(200).json({
            success:true,
            message:"entry done successfully"
        })

    }catch(err){

        console.log(err);
        return res.json({
            success:false,
            message: err
        })
    }
}

// Get all Categorys
exports.showAllCategories= async(req,res)=>{
    try{

        const allCategory = await Category.find({},{name:true,description:true});
        console.log(allCategory);
        res.status(200).json({
            success:true,
            message:"Entry returned successfully",
            data: allCategory
        })

    }catch(err){
        console.log(err);
        res.json({
            sucess:false,
            message:err

        })
    }




}

// getting categoru details

exports.categoryPageDetails= async(req,res)=>{

    try{
        // getting categoryId
        const{categoryId}= req.body
        // fetching all data from given id
        const selectCategory = await Category.findById(categoryId).populate("course").exec()
        if(!selectCategory){
            return res.json({
                success:false,
                message:"Category not found"
            })
        }
        // related course
        const diffcategories = await Category.find({_id:{$ne: categoryId}}).populate("course").exec()

        

        // popular category or top selling course

        return res.json({
            success:true,
            selectCategory,
            diffcategories,

            
        })

    }catch(err){
        res.json({
            success:false,
            message:err
        })

    }
}
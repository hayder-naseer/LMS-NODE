const express = require("express");
const Sequelize=require("sequelize")
const router = express.Router();

const {redirectHome,redirectLogin}=require("../middleware/redirect")



var categoryModel=require("../models").Category;
var userModel=require("../models").User;
var bookModel=require("../models").Book;

router.get("/admin",redirectLogin,async function(req,res,next){
    
    var total_category= await categoryModel.count();
    var total_user= await userModel.count();
    var total_book= await bookModel.count();

    res.render("admin/dashboard",{
        category:total_category,
        user:total_user,
        book:total_book,
        title:"Dashboard"
    });
})
module.exports = router; 
const express = require("express");
const Sequelize =require("sequelize")
var Op=Sequelize.Op
//local model

var categoryModel=require("../models").Category;
var userModel=require("../models").User;
var bookModel=require("../models").Book;
var issueBookModel=require("../models").IssueBook;
var dayModel=require("../models").DaySetting;

const router = express.Router();

router.route("/admin/issue-book").get(async function(req,res,next){


    var days=await dayModel.findAll({
        where:{
            status:'1'
        }
    })
    var catergories = await categoryModel.findAll({
        where:{
            status:{
                [Op.eq]:'1'
            }
        }
    })

    var users = await userModel.findAll({
        where:{
            status:{
                [Op.eq]:'1'
            }
        }
    })

    res.render("admin/issue-a-book",{
        catergories:catergories,
        users:users,
        days:days
    });



}).post(async function(req,res,next){

   var is_book_issued =await issueBookModel.count({
       where:{
           userId:{
               [Op.eq]:req.body.dd_user
           },
           bookId:{
            [Op.eq]:req.body.dd_book
           },
           is_returned:{
            [Op.eq]:'0'
           }
       }
   });
   console.log("{is_book_issued}",is_book_issued);
   if(is_book_issued > 0){
    req.flash("error","book has been issued");
    res.redirect("/admin/issue-book")
   }else{
    var count_books = await issueBookModel.count({
        where:{
            userId:{
                [Op.eq]:req.body.dd_user
            },
            is_returned:{
                [Op.eq]:'0'
            }
        }
    });
       if(count_books >= 2){
           req.flash("error","Maximum number of book");
           res.redirect("/admin/issue-book")
       }else{
        issueBookModel.create({
            categoryId:req.body.dd_category,
            bookId:req.body.dd_book,
            userId:req.body.dd_user,
            days_issued:req.body.dd_days,
        }).then((status)=>{
            if(status){
                    req.flash("success","Book has been issueed successfully")
            }else{
                req.flash("failed","Failed to issued ")
            }
            res.redirect("/admin/list-issue-book")
        })
       }
   }

})

router.get("/admin/list-issue-book",async function(req,res,next){
    
    var issueList = await issueBookModel.findAll({
        include:[
            {
                model:categoryModel,
                attributes:["name"]
            },
            {
                model:bookModel,
                attributes:["name"]
            },
            {
                model:userModel,
                attributes:["name","email"]
            }
        ],
        attributes:["days_issued","issued_date"],
        where:{
            is_returned:{
                [Op.eq]:"0"
            }
        }
    })
    //res.json(issueList);
    res.render("admin/issue-history",{
        list: issueList
    });
})

router.post("/admin/category-list-book",async function(req,res,next){
    var category_id = req.body.cat_id

    var books = await bookModel.findAll({
        where:{
            categoryId:{
                [Op.eq]:category_id
            }
        }
    });
    return res.json({
        status:1,
        books:books
    })
    
})
module.exports = router; 
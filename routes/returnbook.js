const express = require("express");
const Sequelize = require("sequelize");

const Op= Sequelize.Op

//local models
var userModel=require("../models").User;
var issueBooksModel=require("../models").IssueBook;
var booksModel=require("../models").Book;
var categoryModel=require("../models").Category;

const router = express.Router();

router.route("/admin/return-a-book/").get(async function(req,res,next){

    var all_users = await userModel.findAll({
        where:{
            status:{
                [Op.eq]:"1",
            }
        }
    });
    res.render("admin/return-a-book",{
        users:all_users
    });
}).post(function(req,res,next){
    issueBooksModel.update({
        is_returned:'1',
        retured_date: Sequelize.fn("NOW")
    },{
        where:{
            userId:{
                [Op.eq]:req.body.dd_user
            },bookId:{
                [Op.eq]:req.body.dd_book
            },
            is_returned:'0'
        }
    }).then((status)=>{
        if(status){
           req.flash("success","Book has been return successfully")
        }else{
            req.flash("error","Failed to return Book")
        }
        res.redirect("/admin/return-a-book")
    })
})

router.get("/admin/return-list-book",async  function(req,res,next){
    
    var returnedList = await issueBooksModel.findAll({
        include:[
            {
                model:categoryModel,
                attributes:["name"]
            },
            {
                model:booksModel,
                attributes:["name"]
            },
            {
                model:userModel,
                attributes:["name","email"]
            }
        ],
        attributes:["days_issued","retured_date"],
        where:{
            is_returned:{
                [Op.eq]:"1"
            }
        }
    })

    res.render("admin/return-list",{
        list:returnedList
    });
})
/* handle ajax request */
router.post("/admin/user-list-book",async function(req,res,next){
    var user_id = req.body.user_id

    var all_books = await issueBooksModel.findAll({
        include:[{
            model:booksModel,
            attributes:["name"]
        }],
        where:{
            userId:{
                [Op.eq]:user_id
            },
            is_returned:{
                [Op.eq]: '0'
            }
        },
        attributes:["bookId"]
    });
    return res.json({
        status:1,
        books:all_books
    })
})

module.exports = router; 
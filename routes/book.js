const express = require("express");
const Sequelize = require("sequelize");

var categoryModel=require("../models").Category
var Op=Sequelize.Op;
var bookModel=require("../models").Book;
var optionModel = require("../models").Option 

const router = express.Router();

router.route("/admin/add-book").get(async function(req,res,next){
    var categories = await categoryModel.findAll({
        where:{
            status:{
                [Op.eq]: '1'
            }
        }
    })
    var currency_data = await optionModel.findOne({
        where:{
            option_name:{
              [Op.eq]:"active_currency"
            }
        }
    })
    res.render("admin/add-book",{
        categories:categories,
        currency_data:currency_data,
    });
}).post (function(req,res,next){
        var image_attr = req.files.cover_image;
        
        var valid_image_extension=["image/png","image/jpg","image/jpeg"];

        if(valid_image_extension.includes(image_attr.mimetype)){
            image_attr.mv("./public/uploads/"+image_attr.name);
            bookModel.create({
                name: req.body.name,
                categoryId: req.body.dd_category,
                description: req.body.description,
                amount: req.body.amount,
                cover_image:"/uploads/"+image_attr.name,
                author: req.body.author,
                status: req.body.status
            }).then((status)=>{
                if(status){
                    req.flash("success","Book has been created");
                }else{
                    req.flash("error","Failed to create book")
                }
                res.redirect("/admin/add-book")
            })
        }else{
            req.flash("error","Invalid file selected");
            res.redirect("/admin/add-book");
        }
});

router.get("/admin/list-book",async function(req,res,next){

    var currency_data = await optionModel.findOne({
        where:{
            option_name:{
              [Op.eq]:"active_currency"
            }
        }
    })

    var books=await bookModel.findAll({
        includes:{
            model:categoryModel,
            attributes:["name"]
        }
    })
    //res.json(books)
    res.render("admin/list-book",{
        books:books,
        currency_data:currency_data,
    });
})

router.route("/admin/edit-book/:bookId").get(async function(req,res,next){
    var book_data = await bookModel.findOne({
        where:{
            id:{
                [Op.eq]:req.params.bookId
            }
        }
    });
    var currency_data = await optionModel.findOne({
        where:{
            option_name:{
              [Op.eq]:"active_currency"
            }
        }
    })
    var categories = await categoryModel.findAll({
        where:{
            status:{
                [Op.eq]: '1'
            }
        }
    })


    res.render("admin/edit-book",{
        book:book_data,
        categories:categories,
        currency_data:currency_data,
    });
}).post(function(req,res,next){
    if(!req.files){
        bookModel.update({
            name: req.body.name,
            categoryId: req.body.dd_category,
            description: req.body.description,
            amount: req.body.amount,
            author: req.body.author,
            status: req.body.status   
        },{
            where:{
                id:{
                    [Op.eq]:req.params.bookId
                }
            }
        }).then((data)=>{
            if(data){
                req.flash("success","Book has bee updated")
            }else{
                req.flash("error","Book has bee not update")
            }
            res.redirect("/admin/edit-book/"+req.params.bookId)
        })
    }else{

        var image_attr = req.files.cover_image;
        
        var valid_image_extension=["image/png","image/jpg","image/jpeg"];

        if(valid_image_extension.includes(image_attr.mimetype)){
            image_attr.mv("./public/uploads/"+image_attr.name);
            bookModel.update({
                name: req.body.name,
                categoryId: req.body.dd_category,
                description: req.body.description,
                amount: req.body.amount,
                cover_image:"/uploads/"+image_attr.name,
                author: req.body.author,
                status: req.body.status
            },{
                where:{
                    id:{
                        [Op.eq]:req.params.bookId
                    }
                }
            }).then((data)=>{
                if(data){
                    req.flash("success","Book has been update");
                }else{
                    req.flash("error","Failed to update book")
                }
                res.redirect("/admin/edit-book/"+req.params.bookId)
            })
        }else{
            req.flash("error","Invalid file selected");
            res.redirect("/admin/edit-book/"+req.params.bookId)
        }

    }
})
router.post("/admin/delete-book/:bookId",function(req,res,next){
    console.log("params =>",req.body.book_id)
    console.log("params =>",req.params.book_id)
    bookModel.findOne({
        where:{
            id:{
                [Op.eq]:req.body.book_id
            }
        }
    }).then((data)=>{
        if(data){
             bookModel.destroy({
                 where:{
                     id:{
                         [Op.eq]:req.body.book_id
                     }
                 }
             }).then((status)=>{
                 if(status){
                    req.flash("success","Book has been deleted")
                    res.redirect("/admin/list-book")
                 }else{
                    req.flash("error","Failed to delete Book")
                    res.redirect("/admin/list-book")
                 }
             })
        }else{
            req.flash("error","Invalid Book not found")
            res.redirect("/admin/list-book")
        }
    })
})
module.exports = router; 
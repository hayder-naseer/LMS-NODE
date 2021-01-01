const express = require("express");
const Sequelize=require("sequelize")
const router = express.Router();
var adminModel = require("../models").Admin
const bcrypt = require("bcrypt")

var Op=Sequelize.Op

const {redirectHome,redirectLogin}=require("../middleware/redirect")


router.route("/admin/login").get(redirectHome , function(req,res,next){
    res.render("login");
}).post(function(req,res,next){
    adminModel.findOne({
        where:{
            email:{
                [Op.eq]:req.body.email
            }
        }
    }).then((user)=>{
        if(user){
            bcrypt.compare(req.body.password,user.password,function(error,result){

              if(result){
                  req.session.isLoggedIn=true,
                  req.session.userId=user.id
                  console.log(req.session)
                res.redirect("/admin")
              }else{
                req.flash("error","Invalid user not found")
                res.redirect("/admin/login")
              }

            });
        }else{
            req.flash("error","User not found")
            res.redirect("/admin/login")
        }

    })
})

router.get("/admin/register",function(req,res,next){
    adminModel.create({
        name:"Online Web Tutor",
        email:"haidernaseer339@gmail.com",
        password:bcrypt.hashSync("123456",10)
    }).then((data)=>{
        if(data){
           res.json({
               status:1,
               message:"Admin created successfully"
           })
        }else{
            res.json({
                status:1,
                message:"Failed to create admin"
            })
        }
    })
})
router.get("/admin/logout",redirectLogin,function(req,res,next){
    req.session.destroy((error)=>{
        if(error){
            res.redirect("/admin")
        }
        console.log("logout",req.session)
        res.redirect("/admin/login")
    })
})
module.exports = router; 
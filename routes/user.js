const express = require("express");
const Sequelize=require ("sequelize")
var Op=Sequelize.Op
//local model
var userModel=require("../models").User;

const router = express.Router();

router.route("/admin/add-user").get(function(req,res,next){
    res.render("admin/add-user");
}).post(function(req,res,next){
    userModel.findOne({
        where:{
            email:{
                [Op.eq]:req.body.email
            }
        }
    }).then((data)=>{
         if(data){
            req.flash("error","Email already exist");
            res.redirect("/admin/add-user");
         }else{
            userModel.create({
                name:req.body.name,
                email:req.body.email,
                mobile:req.body.mobile,
                gender:req.body.dd_gender,
                adress:req.body.address,
                status:req.body.status
            }).then((status)=>{
                if(status){
                    req.flash("success","User has been created");
                    res.redirect("/admin/add-user");
                }else{
                    req.flash("error","Failed to save user");
                    res.redirect("/admin/add-user");
                }
                });
         }
    })
    
})

router.get("/admin/list-user",async function(req,res,next){
    var user_data = await userModel.findAll();

    res.render("admin/list-user",{
         users:user_data
    });
})

router.route("/admin/edit-user/:userId").get( async function(req,res,next){
    var userdata= await userModel.findOne({
        where:{
            id:{
                [Op.eq]:req.params.userId
            }
        }
    })
    res.render("admin/edit-user",{
        user:userdata
    });
}).post(function(req,res,next){
    userModel.update({
        name:req.body.name,
        mobile:req.body.mobile,
        gender:req.body.dd_gender,
        adress:req.body.address,
        status:req.body.status
    },{
        where:{
            id:{
                [Op.eq]:req.params.userId
            }
        }
    }).then((status)=>{
        if(status){
            req.flash("success","Success to upload")
        }else{
            req.flash("error","Failed to upload")
        }
        res.redirect("/admin/edit-user/"+req.params.userId)
    })
})
router.post("/admin/delete-user",function(req,res,next){
        userModel.destroy({
            where:{
                id:{
                    [Op.eq]:req.body.user_id
                }
            }
        }).then((status)=>{
              if(status){
                  req.flash("success","User delete successfully")
              }else{
                req.flash("error","User can't delete")
              }
              res.redirect("/admin/list-user")
        })
})
module.exports = router; 
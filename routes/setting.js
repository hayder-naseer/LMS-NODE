const express = require("express");

const Sequelize=require("sequelize")
var Op = Sequelize.Op

var optionModel = require("../models").Option
var daysModel = require("../models").DaySetting

const router = express.Router();

router.route("/admin/currency-setting").get(async function(req,res,next){
    
    var currency_data = await optionModel.findOne({
        where:{
            option_name:{
              [Op.eq]:"active_currency"
            }
        }
    })
    
    res.render("admin/currency-setting",{
        currency_data:currency_data
    });
}).post(function(req,res,next){

    //checking the key
    optionModel.findOne({
        where:{
            option_name:{
                [Op.eq]:"active_currency"
            }
        }
    }).then((data)=>{
        if(data){
             optionModel.update({
                 option_value:req.body.dd_currency
             },{
                 where:{
                     option_name:{
                         [Op.eq]:"active_currency"
                     }
                 }
             }).then((status)=>{
                if(status){
                    req.flash("success","Currency setting Update")
                }else{
                    req.flash("error","Failed to update setting ") 
                }
                res.redirect("/admin/currency-setting")
             })
        }else{
            optionModel.create({
              option_name:"active_currency",
              option_value:req.body.dd_currency
            }).then((status)=>{
                if(status){
                    req.flash("success","Currency setting save")
                }else{
                    req.flash("error","Failed to setting save") 
                }
                res.redirect("/admin/currency-setting")
            })
        }
    })

})
router.route("/admin/days-setting").get(async function(req,res,next){
    
    var days= await daysModel.findAll()
    res.render("admin/day-settings",{
        days:days
    });
}).post(function(req,res,next){
    daysModel.findOne({
        where:{
            total_days:{
                [Op.eq]:req.body.day_count
            }
        }
    }).then((data)=>{
        if(data){
            req.flash("error","Days Already Exist")
            res.redirect("/admin/days-setting")
        }else{
           daysModel.create({
               total_days:req.body.day_count
           }).then((status)=>{
               if (status){
                req.flash("success","Days has been save")
               }else{
                req.flash("error","Failed to save date")
               }
               res.redirect("/admin/days-setting")
           })
        }
    })
})

router.post("/admin/delete-days/:dayID",function(req,res,next){
    daysModel.destroy({
        where:{
            id:{
                [Op.eq]:req.params.dayID
            }
        }
    }).then((data)=>{
         if(data){
             req.flash("success","Data has been deleted")
         }else{
            req.flash("error","Failed to deleted")
         }
         res.redirect("/admin/days-setting")
    })
})
module.exports = router; 
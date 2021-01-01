const express = require("express");
const Sequelize = require("sequelize");

const router = express.Router();
//local model
var categoryModel= require("../models").Category;

//Op give all the opreater accesssblity
var Op=Sequelize.Op;

router.route("/admin/add-category").get(function(req,res,next){
    res.render("admin/add-category");
}).post(function(req,res,next){
    categoryModel.findOne({
        where:{
            name:{
                [Op.eq]:req.body.name
            }
        }
    }).then((data)=>{
        if(data){
                // kEY , MESSAGE
        req.flash("error","Category Already exist")
        res.redirect("/admin/add-category")            
        }
        else{
            categoryModel.create({
                name:req.body.name,
                status:req.body.status,
            }).then((category) => {
                if(category){
                              // kEY , MESSAGE
                    req.flash("success","Catergory created successfully")
                    res.redirect("/admin/add-category")
                }
                else{
                              // kEY , MESSAGE
                    req.flash("error","Failed to create category")
                    res.redirect("/admin/add-category")
                }
            });
        }
    });

});

router.get("/admin/list-category",async function(req,res,next){
    var all_categories =await categoryModel.findAll();
    res.render("admin/list-category",{
        categories:all_categories
    });
})


router.route("/admin/edit-category/:categoryId").get(function(req,res,next){
    categoryModel.findOne({
        where:{
            id:{
                [Op.eq]:req.params.categoryId
            }
        }
    }).then((data=>{
        res.render("admin/edit-category",{
            category:data,
        });
    }))
}).post(function(req,res,next){
    categoryModel.findOne({
        where:{
            [Op.and]:[
                {
                    id:{
                        [Op.ne]:req.params.categoryId
                    }
                },
                {
                    name:{
                        [Op.eq]:req.body.name
                    }
                }
            ]
        }
    }).then((data)=>{
        if(data){
        req.flash("error","Category already exist");
        res.redirect("/admin/edit-category/"+req.params.categoryId)
        }else{
        categoryModel.update({
            name:req.body.name,
            status:req.body.status
        },{
            where:{
                id:req.params.categoryId  
            }
        }).then((data)=>{
            if(data){
                req.flash("success","Category has been Update");
            }else{
                req.flash("error","Failed to update category")
            }
            res.redirect("/admin/edit-category/"+req.params.categoryId)
        })
    }
  });
});

router.post("/admin/delete-category",function(req,res,next){
    categoryModel.findOne({
        
        where:{
            id:{
                [Op.eq]:req.body.category_id
            }
        }
    }).then((data)=>{
       if(data){
              categoryModel.destroy({
                  where:{
                      id:{
                          [Op.eq]:req.body.category_id
                      }
                  }
              }).then((status)=>{
                  if(status){
                      req.flash("success","Category has been deleted successfully")
                  }
                  else{
                      req.flash("error","Failed to delete category")
                  }
                  res.redirect("/admin/list-category")
              });
       }else{
           
       }
    })
});
module.exports = router; 
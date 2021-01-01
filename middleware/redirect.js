const redirectHome = function(req,res,next){
    if(req.session.userId){
        res.redirect("/admin")
    }else{
        next();
    }
}


const redirectLogin = function(req,res,next){
    if(!req.session.userId){
        res.redirect("/admin/login")
    }else{
        next();
    }
}

module.exports={
    redirectHome,
    redirectLogin
}
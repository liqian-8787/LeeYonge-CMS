const isAdminLogin = (req,res,next)=>{

    if(req.session.userInfo&&req.session.userInfo.role =="Clerk")
    {
        next();
    }
    
    else
    {
        res.redirect("/user/login");
        res.end();
    }

}
module.exports = isAdminLogin;
const isRegularUserLoggedIn = (req,res,next)=>{

    if(req.session.userInfo&&req.session.userInfo.role!="Clerk")
    {
        next();
    }
    
    else
    {
        res.redirect("/user/login")
    }

}

module.exports = isRegularUserLoggedIn;
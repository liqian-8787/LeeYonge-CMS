const dashBoardLoader = (req,res)=>{  
    if(req.session.userInfo.role=="Clerk")
    {
        res.render("user/clerkdashboard",{user:req.session.userInfo});
    }    
    else
    {
        res.render("user/userdashboard",{user:req.session.userInfo});
    }
}
module.exports = dashBoardLoader;
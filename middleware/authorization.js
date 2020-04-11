const dashBoardLoader = (req,res)=>{  
    if(req.session.userInfo.role=="Clerk")
    {
        res.render("user/clerkdashboard",{name:req.session.userInfo.name});
    }    
    else
    {
        res.render("user/userdashboard",{name:req.session.userInfo.name});
    }
}
module.exports = dashBoardLoader;
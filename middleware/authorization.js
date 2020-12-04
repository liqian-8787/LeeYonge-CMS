const dashBoardLoader = (req,res)=>{  
    if(req.session.userInfo.role=="Clerk")
    {
        res.render("dashboard/clerkdashboard",{user:req.session.userInfo});
    }    
    else
    {
        res.render("dashboard/userdashboard",{user:req.session.userInfo});
      
    }
}
module.exports = dashBoardLoader;
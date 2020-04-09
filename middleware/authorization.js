const dashBoardLoader = (req,res)=>{

    if(req.session.userInfo.type=="Clerk")
    {
        res.render("user/clerkDashBoard");
    }
    
    else
    {
        res.render("user/userDashboard");
    }

}


module.exports = dashBoardLoader;
const express = require("express"); 
const router = express.Router(); 

const productsModel = require("./model/products");

const productCategoryModel = require("./model/productCategory");
const promotionFormModel = require("./model/promotionForm");
const bestSellerModel = require("./model/bestSeller");
const loginFormModel = require("./model/loginForm");
const signupFormModel = require("./model/signupForm");

//home router
router.get("/",(req,res)=>{   
    res.render("home",{
        title:"Home",
        headingInfo: "Home",
        promotionForm:promotionFormModel.getProductPromotion(),
        productCategory:productCategoryModel.getProductCategory(),
        bestSeller:bestSellerModel.getBestSeller()        
    });
});

//products router
router.get("/products",(req,res)=>{
    res.render("products",{
        title:"Products",
        headingInfo: "Products",
        products :productsModel.getAllProducts()
    });
});

//signup router
router.get("/signup",(req,res)=>{
    res.render("signup",{
        title:"Sign Up",
        headingInfo:"Sign Up",
        signupForm:signupFormModel.getSignupFormData().map(data=>{//remove properties from data
            delete data.value;
            delete data.errorMessage;
            return data;
        })
    });
});

router.post("/signup",(req,res)=>{
    
    let signupFormData = signupFormModel.getSignupFormData();   
    for(var index in signupFormData){   
        let self =  signupFormData[index];
        switch(self.label){
            case "name":
                if(!req.body.name.trim()){
                    delete self.value;
                    self.errorMessage = "<!> Enter your name";  
                }
                else {
                    self.value = req.body.name; 
                    delete self.errorMessage;     
                }
                break;
            case "email":
                let emailPattern= new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
                if(!req.body.email.trim()){
                    delete self.value;
                    self.errorMessage = "<!> Enter your e-mail";       
                }
                else if(!(emailPattern.test(req.body.password))){
                    delete self.value;
                    self.errorMessage = "<!> Password must be like: somthing@someserver.com";               
                }
                else {
                    self.value=req.body.email;
                    delete self.errorMessage;         
                }
                break;
            case "password":
                let passwordPattern = new RegExp(/^[A-Za-z0-9]{6,12}$/);
                if(!req.body.password.trim()){
                    delete self.value;
                    self.errorMessage = "<!> Enter your password";     
                }
                else if(!(passwordPattern.test(req.body.password))){
                    delete self.value;
                    self.errorMessage = "<!> Password must consist of 6 to 12 characters";               
                }else {
                    self.value=req.body.password;
                    delete self.errorMessage;  
                }
                break;
            case "passwordAgain":
                if(!req.body.passwordAgain.trim()||req.body.passwordAgain!==req.body.password){
                    delete self.value;
                    self.errorMessage = "<!> Password must be match";                
                }else {
                    self.value=req.body.password;
                    delete self.errorMessage;     
                }               
                break;
        }
    } 

    if(signupFormData.filter(errors=>errors.errorMessage!=="").length)//if there is errors in signupformdata
    {      
        res.render("signup",{                
            signupForm:signupFormData                
        });      
    }
    else
    {
        
        res.render("dashboard"); 
    }
});

//login router
router.get("/login",(req,res)=>{
    res.render("login",{
        title:"Log In",
        headingInfo:"Log In",
        loginForm:loginFormModel.getSignupFormData().map(data=>{//remove properties from data
            delete data.value;
            delete data.errorMessage;
            return data;
        })
    });
});

router.post("/login",(req,res)=>{

    let loginFormData = loginFormModel.getLoginFormData(); 
    for(var index in loginFormData){   
        let self =  loginFormData[index];
        switch(self.label){
            case "email":
                if(!req.body.email.trim()){
                    delete self.value;
                    self.errorMessage = "<!> Enter your e-mail";       
                }
                else {
                    self.value=req.body.email;
                    delete self.errorMessage;         
                }
                break;
            case "password":                
                if(!req.body.password.trim()){
                    delete self.value;
                    self.errorMessage = "<!> Enter your password";     
                        
                }else {
                    self.value=req.body.password;
                    delete self.errorMessage;  
                }
                break;
            }
        }
    
    if(loginFormData.filter(errors=>errors.errorMessage!=="").length)//if there is errors in signupformdata
    {      
        res.render("login",{                
            loginForm:loginFormData                
        });      
    }
    else
    {
        res.redirect("/");
    }
});
module.exports=router;
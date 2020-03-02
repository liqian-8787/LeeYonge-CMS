const express = require("express"); 
const router = express.Router(); 

const productsModel = require("../model/products");
const productCategoryModel = require("../model/productCategory");
const promotionFormModel = require("../model/promotionForm");
const bestSellerModel = require("../model/bestSeller");
const loginFormModel = require("../model/loginForm");
const signupFormModel = require("../model/signupForm");

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
        signupForm:signupFormModel.getSignupFormData().map(data=>{
            //remove properties from data
            delete data.value;
            delete data.errorMessage;
            return data;
       })
    });
});

router.post("/signup",(req,res)=>{
    const {name,email,password,passwordConfirm} = req.body;
    let signupFormData = signupFormModel.getSignupFormData();   
    for(var index in signupFormData){   
        let self =  signupFormData[index];
        switch(self.label){
            case "name":
                if(name==""){
                    delete self.value;
                    self.errorMessage = "<!> Enter your name";  
                }
                else {
                    self.value = name; 
                    delete self.errorMessage;     
                }
                break;
            case "email":
                let emailPattern= new RegExp(/^([a-zA-Z0-9.]+)@([a-zA-Z0-9.]+)\.([a-zA-Z]{2,5})$/);
                if(email==""){
                    delete self.value;
                    self.errorMessage = "<!> Enter your e-mail";       
                }
                else if(!(emailPattern.test(email))){
                    delete self.value;
                    self.errorMessage = "<!> Password must be like: somthing@someserver.com";               
                }
                else {
                    self.value=email;
                    delete self.errorMessage;         
                }
                break;
            case "password":
                let passwordPattern = new RegExp(/^[A-Za-z0-9]{6,12}$/);
                if(password==""){
                   delete self.value;
                    self.errorMessage = "<!> Enter your password";     
                }
                else if(!(passwordPattern.test(password))){
                    delete self.value;
                    self.errorMessage = "<!> Password must consist of 6 to 12 characters(letters and numbers)";               
                }else {
                    self.value=password;
                    delete self.errorMessage;  
                }
                break;
            case "passwordConfirm":
                if(passwordConfirm==""||passwordConfirm!==password){
                   delete self.value;
                    self.errorMessage = "<!> Password must be match";                
                }else {
                    self.value=password;
                    delete self.errorMessage;     
                }               
                break;
        }
    } 

    if(signupFormData.filter(errors=>errors.errorMessage).length)//if there is errors in signupformdata
    {      
        res.render("signup",{                
            signupForm:signupFormData                 
        });     
    }
    else
    {        
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        const msg = {
        from: `qianli0108@gmail.com`,
        to: `${email}`,
        subject: 'Signup form submitted',
        html:
         `<strong>Hi.${name}!  welcome to Amazon.</br> 
          Now, you can log in and enjoy your shopping time!!!</strong>`,
        };
        
        sgMail.send(msg)
        .then(()=>{
            res.render("dashboard",{
                name:`${name}`
            });
            
        })
        .catch(err=>{
            console.log(`Error ${err}`);
        }) 
    }
});

//login router
router.get("/login",(req,res)=>{    
    res.render("login",{
        title:"Log In",
        headingInfo:"Log In",
        loginForm:loginFormModel.getLoginFormData().map(data=>{
            delete data.value;     //remove properties from data
            delete data.errorMessage;
            return data;
        })
    });
});

router.post("/login",(req,res)=>{
    const {email,password}=req.body;
    let loginFormData = loginFormModel.getLoginFormData(); 
    for(var index in loginFormData){   
        let self =  loginFormData[index];
        switch(self.label){
            case "email":
                if(email==""){
                    delete self.value;
                    self.errorMessage = "<!> Enter your e-mail";       
                }
                else {
                    self.value=email;
                    delete self.errorMessage;         
                }
                break
            case "password":                
                if(password==""){
                    delete self.value;
                    self.errorMessage = "<!> Enter your password";     
                        
                }else {
                    self.value=password;
                    delete self.errorMessage;  
                }
                break;
        }
    }
    
    if(loginFormData.filter(error=>error.errorMessage).length)//if there is errors in signupformdata
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
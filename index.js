const express = require("express"); //this imports the express package that was installed within your application
const exphbs= require("express-handlebars");
const bodyParser = require('body-parser');
const validator = require('express-validator');

const amazon = express(); // this creates your express amazon object

amazon.use(bodyParser.urlencoded({extended:false}));
//This tells express to set up our template engine has handlebars
amazon.engine("handlebars",exphbs());
amazon.set("view engine", "handlebars");
amazon.use(express.static("public"));


const productsModel = require("./model/products");

const productCategoryModel = require("./model/productCategory");
const promotionFormModel = require("./model/promotionForm");
const bestSellerModel = require("./model/bestSeller");

const loginFormModel = require("./model/loginForm");
const signupFormModel = require("./model/signupForm");


amazon.get("/",(req,res)=>{   
    res.render("home",{
        title:"Home",
        headingInfo: "Home",
        promotionForm:promotionFormModel.getProductPromotion(),
        productCategory:productCategoryModel.getProductCategory(),
        bestSeller:bestSellerModel.getBestSeller(),
       
        loginForm:loginFormModel.getLoginFormData()
    });
});
amazon.get("/products",(req,res)=>{
    res.render("products",{
        title:"Products",
        headingInfo: "Products",
        products :productsModel.getAllProducts()
    });
});
amazon.get("/signup",(req,res)=>{
    res.render("signup",{
        title:"Sign Up",
        headingInfo:"Sign Up",
        signupForm:signupFormModel.getSignupFormData()
    });
});

amazon.post("/signup",(req,res)=>{

    const errorMessages = [];

    if(req.body.name=="")
    {
            errorMessages.push("<!> Enter your name");
    }

    if(req.body.email=="")
    {
            errorMessages.push("<!> Enter your e-mail");
    }
   
    if(req.body.password!="/^[A-Za-z0-9]{6,12}$/")
    {
            errorMessages.push("<!> Enter your password");
    }

    if(req.body.passwordAgain!=req.body.password)
    {
            errorMessages.push("<!> Password must be matched");
    }

    if(errorMessages.length >0 )
    {
            res.render("signup",{
                signupForm:signupFormModel.getSignupFormData(),
                    signupErrors : errorMessages
            });
    }
    else
    {
        res.redirect("/");


    }
});

amazon.get("/login",(req,res)=>{
    res.render("login",{
        title:"Log In",
        headingInfo:"Log In",
        loginForm:loginFormModel.getLoginFormData()
    });
});

amazon.post("/login",(req,res)=>{

    const errorMessages = [];

    if(req.body.email=="")
    {
            errorMessages.push("<!>  Your e-mail is not found");
    }
   
    if(req.body.password!="")
    {
            errorMessages.push("<!> Password is incorrect");
    }

    if(errorMessages.length >0 )
    {
            res.render("login",{
                loginForm:loginFormModel.getLoginFormData(),
                    loginErrors : errorMessages
            });
    }
    else
    {
        res.redirect("/");
    }
});

const PORT=process.env.PORT ||3000;
//This creates an Express Web Server that listens to incoming HTTP requests.
amazon.listen(PORT,()=>{
    console.log(`Web Server Started`);
});
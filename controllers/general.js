const express = require("express"); 
const router = express.Router(); 

const productsModel = require("../model/products");
const productCategoryModel = require("../model/productCategory");
const promotionFormModel = require("../model/promotionForm");
const bestSellerModel = require("../model/bestSeller");


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
module.exports=router;
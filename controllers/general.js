const express = require("express"); 
const router = express.Router(); 

const productsModel =  require("../model/productSchema");
const productCategoryModel = require("../model/productCategory");
const promotionFormModel = require("../model/promotionForm");
const bestSellerModel = require("../model/bestSeller");


//home router
router.get("/",(req,res)=>{  
       
    productsModel.find().then((products)=>{
        const allProducts = products.map(product=>{           
            return{
                name : product.name,
                description : product.description,
                image_url : product.image_url,
                price : product.price,
                category:product.category,
                isBestSeller:product.isBestSeller,
                promotional_price:product.promotional_price,
                quantity:product.quantity             
            }           
        })
        // const bestSeller = allProducts.filter(product=>{
        //     if(product.isBestSeller)
        //     return{
        //         name : product.name,
        //         description : product.description,
        //         image_url : product.image_url,
        //         isBestSeller:product.isBestSeller,
        //     }            
        // });
        const bestSeller = allProducts.filter(product=>product.isBestSeller);
        const allPromolProducts = allProducts.filter(product=>product.promotional_price&&(product.promotional_price<product.price));

        res.render("home",{
            title:"Home",
            headingInfo: "Home",
            promotionForm:allPromolProducts,
            productCategory:productCategoryModel.getProductCategory(),
            bestSeller:bestSeller        
        }); 
    })
});

//products router
router.get("/products",(req,res)=>{
    productsModel.find().then((products)=>{
        const allProducts = products.map(product=>{
            return{
                name : product.name,
                description : product.description,
                image_url : product.image_url,
                price : product.price,
                category:product.category,
                isBestSeller:product.isBestSeller                
            }
        })
        res.render("products",{
            title:"Products",
            headingInfo: "Products",
            products : allProducts
        });
    })    
});
module.exports=router;
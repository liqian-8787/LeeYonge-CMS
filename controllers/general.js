const express = require("express"); 
const router = express.Router(); 

const productsModel =  require("../model/productSchema");
const productCategoryModel = require("../model/productCategory");


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
router.get("/products/:category?",(req,res)=>{
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

        const allCategories = allProducts.map(product=>{
            return{
                category:product.category,
                text:product.category.replace(/_+|-+/g, ' '),
                isActive: req.params.category == product.category?true:false    
            }
        })  
        //Used for navigation active.
        //Keywords "All" or undefined keywards will consider all category
        const allCategoryCond = req.params.category=="All" ||typeof(req.params.category) =='undefined'?true:false;

        let allDistinctCategories = allCategories.filter((elem, index, self) => self.findIndex(
            (t) => {return (t.category === elem.category && t.text === elem.text)}) === index); 
      
        /*Always place All selection on top*/
        allDistinctCategories.unshift({category:"All",text:"All",isActive: allCategoryCond });
        
        const searchedProducts =  allCategoryCond ? allProducts : allProducts.filter(product=>product.category==req.params.category);   
       
        res.render("products",{
            title:"Products",
            headingInfo: "Products",
            products : searchedProducts,
            allDistinctCategories:allDistinctCategories,
            allDistinctCategoriesText: allDistinctCategories
        });
    })    
});

module.exports=router;
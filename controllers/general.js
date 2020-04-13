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
router.get("/products/:slug?",(req,res)=>{
    productsModel.find().then((products)=>{

        const isUserLoggedin = req.session.userInfo&&req.session.userInfo.role!="Clerk"?true:false;

        const allProducts = products.map(product=>{
            return{
                name : product.name,
                description : product.description,
                image_url : product.image_url,
                price : product.price,
                category:product.category.trim(),
                slug:product.category.trim().replace(/ +/g,'_'),//replace all spaces in category by one underscore for url
                isBestSeller:product.isBestSeller,
                product_url:`/product/pid=${product._id}`,                                                          
            }
        })

        const allCategories = allProducts.map(product=>{
            return{
                category:product.category,
                slug:product.slug,
                text:product.category.replace(/_+|-+/g, ' '),
                isActive: req.params.slug == product.slug?true:false    
            }
        })  
        //Used for navigation active. [{key:abc, value:cd},{key:abc,value:cd}]
        //Keywords "All" or undefined keywards will consider all category
        const allCategoryCond = req.params.slug=="All" ||typeof(req.params.slug) =='undefined'?true:false;
        
        let allDistinctCategories = allCategories.filter((elem, index, self) => self.findIndex(
            (t) => {return (t.category === elem.category && t.text === elem.text)}) === index); 
      
        /*Always place All selection on top*/
        allDistinctCategories.unshift({category:"All",slug:"All",text:"All",isActive: allCategoryCond });

        const searchedProducts =  allCategoryCond ? allProducts : allProducts.filter(product=>product.slug==req.params.slug);   
     
        res.render("products",{
            title:"Products",
            headingInfo: "Products",
            products : searchedProducts,
            allDistinctCategories:allDistinctCategories,
            isUserLoggedin:isUserLoggedin
        });
    })    
});

module.exports=router;
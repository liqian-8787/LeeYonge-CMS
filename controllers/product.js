
/*********************PRODUCT ROUTES***************************/
const express = require('express')
const router = express.Router();
const productModel  = require("../model/productSchema");
const isAuthenticated = require("../middleware/auth");

//Route to direct use to Add Task form
router.get("/add",isAuthenticated,(req,res)=>
{
    //res.render("Task/taskAddForm");
});

//Route to process user's request and data when the user submits the add task form
router.post("/add",isAuthenticated,(req,res)=>
{
     const newProduct = {
        name : req.body.name,
        description : req.body.description,
        image_url : req.body.image_url,
        price : req.body.price,
        category:req.body.category,
        isBestSeller:req.body.isBestSeller,
        promotional_price:req.body.promotional_price,
        quantity:req.body.quantity
     }

     const product =  new productModel(newProduct);
     product.save()
     .then((item)=>{  
         req.session.addedProduct = item;         
         res.redirect("/product/list")         
     })
     .catch(err=>console.log(`Error happened when inserting product in the database :${err}`));
});


router.get("/list",isAuthenticated,(req,res)=>{
    productModel.find().then((products)=>{
        const allProducts = products.map(product=>{           
            return{
                id: product._id,
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
        const allCategories = allProducts.map(product=>{
            return{
                category:product.category
            }
        })   
        let currentOption =  req.session.filterCategory;
        let allDistinctCategories = [... new Set(allCategories.map(item=>item.category))];
        

        allDistinctCategories.push("All");       
        
        if(typeof(req.session.filterCategory)=='undefined'){
            currentOption = "All";
        } 
        
        /*Move select options*/        
        if (allDistinctCategories.indexOf(currentOption) > 0) {            
            let index = allDistinctCategories.indexOf(currentOption);           
            allDistinctCategories.splice(index,1);           
            allDistinctCategories.unshift(currentOption);            
        }  
      
        const searchedProducts = req.session.filterCategory=="All"||typeof(req.session.filterCategory)=='undefined' ? allProducts : allProducts.filter(product=>product.category==req.session.filterCategory)    
        if(req.session.userInfo.role=="Clerk"){              
            res.render("product/operation",{
                products:searchedProducts,
                allDistinctCategories:allDistinctCategories,                
                userInfo:req.session.userInfo,               
                addedProduct: req.session.addedProduct,
                generalMessage:req.session.generalMessage
            });             
        } else{
            res.render("products",{
                title:"Products",
                headingInfo: "Products",
                products : allProducts
            });
        }
    }).catch(err=>console.log(`Error ${err}`));    
})

router.get("/search",(req,res)=>{
    //res.redirect("/product/list");
})

router.post("/search",(req,res)=>{
    req.session.filterCategory = req.body.product_category;
    req.session.addedProduct=[];
    req.session.generalMessage=[];
    res.redirect("/product/list"); 
})

router.put("/update/:id",(req,res)=>{
    productModel.findById(req.params.id)
    .then((products)=>{        
        const productInfo =
        {
            _id:products._id,
            name:req.body.name,
            price:req.body.price,
            promotional_price:req.body.promotional_price,            
            description : req.body.description,
            image_url : req.body.image_url,
            category:req.body.category,
            isBestSeller:req.body.isBestSeller,
            quantity:req.body.quantity     
        }    
        productModel.updateOne({_id:req.params.id},productInfo)
        .then(()=>{
            res.redirect("/product/list");
        })
        .catch(err=>console.log(`Error happened when updating data from the database :${err}`));    

    })
    .catch(err=>console.log(`Error happened when pulling from the database :${err}`));
   
});

router.delete("/delete/:id",(req,res)=>{
    productModel.deleteOne({_id:req.params.id})
    .then(()=>{
        req.session.generalMessage = "A product has been deleted";
        req.session.addedProduct=[];
        res.redirect("/product/list");
    })
    .catch(err=>console.log(`Error happened when updating data from the database :${err}`));
});


module.exports=router;
const express = require('express')
const router = express.Router();
const path = require("path");
const shoppingCartModel = require("../model/shoppingCart");
const productModel = require("../model/productSchema");

const isRegularUserAuth = require("../middleware/authRegularUser");

router.get("/", isRegularUserAuth, (req, res) => {
    const shoppingCartProduct = {
        uid: req.session.userInfo._id,
        userInfo: req.session.userInfo,
        products: [
            {
                pid: req.body.product_id,
                quantity: parseInt(req.body.quantity)
            }
        ]
    }
    const cart = new shoppingCartModel(shoppingCartProduct);
    shoppingCartModel.findOne({ uid: cart.uid }).then((ct) => {
        if (ct) {
            const allProductsIds = ct.products.map(p => p.pid);
            productModel.find({ _id: { $in: allProductsIds } }).then((items) => {
                const products = items.map(item=>{
                    return {
                        id: item._id,
                        name: item.name,
                        price: item.price,
                        description: item.description,
                        image_url: item.image_url
                    }
                 })              
                const productsJoined = products.map((product)=>{                
                    product.purchased_quantity = ct.products.filter((p)=>{return (product.id==p.pid) ? p.quantity:0})[0].quantity;
                    return product;
                }); 
                let subTotal = 0;    
                productsJoined.forEach((product)=>{                   
                    subTotal += product.price*product.purchased_quantity
                });                
                const cartInfo = {
                    productInfo:productsJoined,
                    subTotal:subTotal.toFixed(2)
                }            
                res.render("product/shoppingcart", {
                    products:productsJoined,
                    cartInfo:cartInfo,  
                    userInfo:req.session.userInfo
                });               
            })
        }
        else {
            //TODO: Add empty shopping cart View
            console.log("Cart is empty!");
        }

    })

});

router.post("/", isRegularUserAuth, (req, res) => {

    const shoppingCartProduct = {
        uid: req.session.userInfo._id,
        userInfo: req.session.userInfo,
        products: [
            {
                pid: req.body.product_id,
                quantity: parseInt(req.body.quantity)
            }
        ]
    }

    const cart = new shoppingCartModel(shoppingCartProduct);

    shoppingCartModel.findOne({ uid: cart.uid }).then((ct) => {
        let genericMessage = "";
        if (ct) {
            const existProduct = ct.products.filter(product => product.pid == cart.products[0].pid).length ? true : false;            
            if (existProduct) {
                const itemIndex = ct.products.findIndex(p => p.pid == cart.products[0].pid);
                let productItem = ct.products[itemIndex];
                const newQuantity = productItem.quantity + cart.products[0].quantity;
                productItem.quantity = newQuantity;
                ct.products[itemIndex] = productItem;
                shoppingCartModel.updateOne({ 'products.pid': cart.products[0].pid }, { $set: { "products.$.quantity": newQuantity } }).then(() => {
                    genericMessage = `The following exsiting product in shopping cart quantity is updated`;
                    productModel.findOne({ _id: cart.products[0].pid })
                        .then((item) => {
                            const product = {
                                id: item._id,
                                name: item.name,
                                price: item.price,
                                description: item.description,
                                image_url: item.image_url
                            }
                            res.render("product/description", {
                                message: genericMessage,
                                product
                            });
                        })
                        .catch(err => console.log(`${err}`));

                }).catch(err => console.log(`${err}`));
            } else {
                shoppingCartModel.updateOne({ uid: cart.uid }, { $push: { products: cart.products } }).then(() => {
                    console.log(`This new product is added to shopping cart`);
                    genericMessage = `This new product is added to shopping cart`;
                    productModel.findOne({ _id: cart.products[0].pid })
                        .then((item) => {
                            const product = {
                                id: item._id,
                                name: item.name,
                                price: item.price,
                                description: item.description,
                                image_url: item.image_url
                            }
                            res.render("product/description", {
                                message: genericMessage,
                                product
                            });
                        })
                        .catch(err => console.log(`${err}`));
                }).catch(err => console.log(`${err}`));
            }
        } else {
            cart.save()
                .then(() => {
                    console.log(`new user is created in shopping cart!`);
                    genericMessage = `new user is created in shopping cart!`;
                    productModel.findOne({ _id: cart.products[0].pid })
                        .then((item) => {
                            const product = {
                                id: item._id,
                                name: item.name,
                                price: item.price,
                                description: item.description,
                                image_url: item.image_url
                            }
                            res.render("product/description", {
                                message: genericMessage,
                                product
                            });
                        })
                        .catch(err => console.log(`${err}`));
                })
                .catch(err => console.log(`Error happened when inserting in the database :${err}`));
        }
    }).catch(err => console.log(`${err}`));

})

router.post("/update",isRegularUserAuth,(req,res)=>{   
    let updatedCart=[];
    shoppingCartModel.find({ uid: req.session.userInfo._id }).then((items) => {
        if(items){
            req.body.product_id.forEach((id)=>{
                let idx = req.body.product_id.indexOf(id);
                const quantity = req.body.purchased_quantity[idx];
                //updatedCart format: [{id:5e8fe4604c6f111908db6e3d,quantity:55},{id:5e8fe48c4c6f111908db6e3e,quantity:11}]
                updatedCart.push({id:id,quantity:quantity});                             
            })              
            var updates = updatedCart.map((item)=>{                
                return shoppingCartModel.updateOne({"products.pid": item.id}, {"$set": {"products.$.quantity": item.quantity }});       
            });            
            Promise.all(updates).then(()=>{
               res.redirect('/shoppingcart');
            }); 
        }
    });
})

module.exports = router;


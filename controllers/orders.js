const express = require('express')
const router = express.Router();
const path = require("path");
const ordersModel = require("../model/orders");
const productModel = require("../model/productSchema");

const isAdminLogin = require("../middleware/authAdminUser");

router.get("/",isAdminLogin,(req, res) => {
    ordersModel.find().then(items => {        
        // const allOrders = items.map(item=>{
        //     return {                
        //         uid:item.uid,
        //         orders:items.orders
        //     }
        // })
        // const allOrdersNew = _.cloneDeep(items);
        // console.log(allOrdersNew)
       
        // productModel.find({ _id: { $in: allProductsIds } }).then((items) => {
        //     const products = items.map(item => {
        //         return {
        //             id: item._id,
        //             name: item.name,
        //             price: item.price,
        //             description: item.description,
        //             image_url: item.image_url
        //         }
        //     })
        //     const productsJoined = products.map((product) => {
        //         product.purchased_quantity = orderedProducts.filter((p) => { return (product.id == p.pid) ? p.quantity : 0 })[0].quantity;
        //         return product;
        //     });
        //     // const cartInfo = {
        //     //     productInfo: productsJoined,
        //     //     subTotal: orderedProducts.cart_total
        //     // }
        //     res.render("orders", {
        //         OrdersList: productsJoined               
        //     });
        // })
      
        res.render("orders", {
            title: "Orders",
            headingInfo: "Orders",
            OrdersList: items
        });
        // console.log(orderedProducts[0].name)
    })
})

module.exports = router;

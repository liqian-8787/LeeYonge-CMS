const express = require('express')
const router = express.Router();
const path = require("path");
const ordersModel = require("../model/orders");
const productModel = require("../model/productSchema");
// Load the full build.
var _ = require('lodash');
// Load the core build.
var _ = require('lodash/core');
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require('lodash/fp');
 
// Load method categories.
var array = require('lodash/array');
var object = require('lodash/fp/object');
 
// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
var at = require('lodash/at');
var curryN = require('lodash/fp/curryN');

const isRegularUserAuth = require("../middleware/authRegularUser");

router.get("/", (req, res) => {
    ordersModel.find().then(items => {        
        const allOrders = items.map(item=>{
            return {                
                uid:item.uid,
                orders:_.cloneDeep(item.orders)
            }
        })
        // const allOrdersNew = _.cloneDeep(items);
        // console.log(allOrdersNew)
        var allOrdersNew=_.cloneDeep(items);
        console.log(allOrdersNew)
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
            OrdersList: allOrders
        });
        // console.log(orderedProducts[0].name)
    })
})

module.exports = router;

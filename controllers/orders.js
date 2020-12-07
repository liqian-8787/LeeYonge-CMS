const express = require('express')
const router = express.Router();
const path = require("path");
const ordersModel = require("../model/orders");
const userModel = require("../model/user");
const productsWithAWSUrl = require("../model/awsSyncProduct");
const isAdminLogin = require("../middleware/authAdminUser");
const { ConnectionStates } = require('mongoose');

router.get("/", isAdminLogin,(req, res) => {
    const userInfo = req.session.userInfo.name;
    ordersModel.find().then(items => {     
        items.forEach((item) => {                      
            item.orders.forEach(order => {
                productsWithAWSUrl.allProductsWithPresignedUrl(order.products).then(
                    (refinedProducts) => {
                        const orderedProducts = refinedProducts.map(product => ({
                            name: product.name,
                            image_url: product.image_url,
                            description: product.description,
                            price: product.price,
                            promotional_price: product.promotional_price,
                            quantity: product.quantity
                        }))
                        order.products = orderedProducts;
                    }
                );
            })
        })       
        const queryParam = req.query.order_filter ? req.query.order_filter : "all";
        var categoryFilter = "all";
        const newItems = items.map(item => ({
            ...item, orders: item.orders.filter(order => {
                if (queryParam.toLocaleLowerCase() === 'ispaid'){
                    categoryFilter = "isPaid";
                    return order.isPaid;
                }                   
                else if (queryParam.toLocaleLowerCase() === "ispickedup"){
                    categoryFilter = "ispickedup";
                    return order.isPickedUp;
                }
                    
                else if (queryParam.toLocaleLowerCase() === "iscancelled")
                {
                    categoryFilter = "isCancelled";
                    return order.isCancelled;
                }
                else
                {
                    categoryFilter = "all";
                    return order;
                } 
            })
        })).filter(item => item.orders.length > 0);
        res.render("orders", {
            title: "Orders",
            headingInfo: "Orders",
            categoryFilter:categoryFilter,
            filteredOrders: newItems,
            user:userInfo,
        })
    })
})

router.put("/update/:id", (req, res) => {    
    const userInfo = req.session.userInfo.name;
    const query={uid:req.body.uid,"orders._id":req.params.id};
    const updateContent={
        $set:{
            "orders.$.isPaid":req.body.isPaid,
            "orders.$.isPickedUp":req.body.isPickedUp,
            "orders.$.isCancelled":req.body.isCancelled,
            "orders.$.updatedBy":userInfo
        }
    }
    ordersModel.updateOne(query,updateContent).then(()=>{
        res.redirect(req.get('referer'));
    
    }).catch(err => console.log(`Error happened when updating data from the database :${err}`));
       
})

module.exports = router;

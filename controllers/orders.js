const express = require('express')
const router = express.Router();
const path = require("path");
const ordersModel = require("../model/orders");
const userModel = require("../model/user");
const productsWithAWSUrl = require("../model/awsSyncProduct");
const isAdminLogin = require("../middleware/authAdminUser");
const { ConnectionStates } = require('mongoose');
const { body } = require('express-validator');

router.get("/", isAdminLogin, (req, res) => {
    const userInfo = req.session.userInfo.name;
    ordersModel.find().then(items => {
        var getPreAssignedProducts = new Promise((resolve, reject) => {
            try {
                if (items.length)
                    items.forEach((item) => {
                        item.orders.forEach((order, index, array) => {
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
                                    if (index === array.length - 1) resolve(items);
                                }
                            )
                        })
                    })
                else
                    resolve(items)
            } catch (ex) {
                reject(ex);
            }
        })
        getPreAssignedProducts.then((items) => {
            const queryParam = req.query.order_filter ? req.query.order_filter : "all";
            var categoryFilter = "all";
            const newItems = items.length ? items.map(item => ({
                ...item._doc, orders: item.orders.filter(order => {
                    if (queryParam.toLocaleLowerCase() === 'ispaid') {
                        categoryFilter = "isPaid";
                        return order.isPaid;
                    }
                    else if (queryParam.toLocaleLowerCase() === "ispickedup") {
                        categoryFilter = "ispickedup";
                        return order.isPickedUp;
                    }

                    else if (queryParam.toLocaleLowerCase() === "iscancelled") {
                        categoryFilter = "isCancelled";
                        return order.isCancelled;
                    }
                    else {
                        categoryFilter = "all";
                        return order;
                    }
                })
            })).filter(item => item.orders.length > 0) : items;
            const bodyParam = req.query.search_name_email?req.query.search_name_email:'';
            
            var serachedItems = newItems.length?newItems.filter(item=>{       
                const name=item.customerInfo.firstName + ' ' +  item.customerInfo.lastName;                         
                if (name.indexOf(bodyParam.toLocaleLowerCase()) !== -1 || item.customerInfo.email.indexOf(bodyParam.toLocaleLowerCase()) !== -1) {
                return item
                }     
                else{
                    return null
                }
            }):newItems;
           
            res.render("orders", {
                title: "Orders",
                headingInfo: "Orders",
                categoryFilter: categoryFilter,
                filteredOrders: serachedItems,
                user: userInfo,
            })
        }).catch(err => {
            console.log(err)
        })

    })
})

router.put("/update/:id", (req, res) => {
    const userInfo = req.session.userInfo.name;
    const query = { uid: req.body.uid, "orders._id": req.params.id };
    const updateContent = {
        $set: {
            "orders.$.isPaid": req.body.isPaid,
            "orders.$.isPickedUp": req.body.isPickedUp,
            "orders.$.isCancelled": req.body.isCancelled,
            "orders.$.updatedBy": userInfo
        }
    }
    ordersModel.updateOne(query, updateContent).then(() => {
        res.redirect(req.get('referer'));

    }).catch(err => console.log(`Error happened when updating data from the database :${err}`));

})

module.exports = router;

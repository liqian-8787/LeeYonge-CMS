const express = require('express')
const router = express.Router();
const path = require("path");
const shoppingCartModel = require("../model/shoppingCart");
const productModel = require("../model/productSchema");
const sgMail = require('@sendgrid/mail');

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
                const products = items.map(item => {
                    return {
                        id: item._id,
                        name: item.name,
                        price: item.price,
                        description: item.description,
                        image_url: item.image_url
                    }
                })
                const productsJoined = products.map((product) => {
                    product.purchased_quantity = ct.products.filter((p) => { return (product.id == p.pid) ? p.quantity : 0 })[0].quantity;
                    return product;
                });
                const cartInfo = {
                    productInfo: productsJoined,
                    subTotal: ct.cart_total
                }
                res.render("product/shoppingcart", {
                    products: productsJoined,
                    cartInfo: cartInfo,
                    userInfo: req.session.userInfo
                });
            })
        }
        else {            
            console.log("Cart is empty!");
            res.render("product/emptycarts");
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
                // const allProductIds =  ct.products.map(p=>p.id);
                productModel.findOne({ _id: cart.products[0].pid }).then((item) => {
                    const productInCart = {
                        pid: item._id,
                        quantity: newQuantity,
                        unit_price: (item.price) ? item.price : 0,
                        name: item.name,
                        category: item.category,
                        image_url: item.image_url,
                        inventory: (item.quantity) ? item.quantity : 0,
                        unit_total: parseFloat(newQuantity * item.price).toFixed(2)
                    }

                    console.log(`product id is: ${productInCart.pid}; unit price is: ${productInCart.unit_price}; unit quantity is: ${productInCart.quantity}`);

                    shoppingCartModel.updateOne({ uid: cart.uid }, { "$pull": { "products": { "pid": productInCart.pid } } }).then(() => {
                        shoppingCartModel.updateOne({ uid: cart.uid }, { $push: { products: productInCart } }).then(() => {
                            shoppingCartModel.findOne({ uid: cart.uid }).then((cartProducts) => {
                                const subTotal = cartProducts.products.map(product => (product.unit_price * product.quantity)).reduce((x, y) => { return (x + y) }).toFixed(2);
                                shoppingCartModel.updateOne({ uid: cart.uid }, { $set: { cart_total: subTotal } }).then(() => {
                                    console.log(`new product information in cart is updated`);
                                    console.log(`cart total is updated to ${subTotal}!`)
                                    console.log(cartProducts);
                                    genericMessage = `new product information in cart is updated`;
                                    res.redirect(`/product/pid=${productInCart.pid}`)
                                })
                            })
                        });
                    })
                });
            } else {
                //new product
                productModel.findOne({ _id: cart.products[0].pid }).then((item) => {
                    const productInCart = {
                        pid: item._id,
                        quantity: cart.products[0].quantity,
                        unit_price: (item.price) ? item.price : 0,
                        name: item.name,
                        category: item.category,
                        image_url: item.image_url,
                        inventory: (item.quantity) ? item.quantity : 0,
                        unit_total: parseFloat(cart.products[0].quantity * item.price).toFixed(2)
                    }
                    console.log(`product id is: ${productInCart.pid}; unit price is: ${productInCart.unit_price}; unit quantity is: ${productInCart.quantity}`);
                    shoppingCartModel.updateMany({ uid: cart.uid }, { $push: { products: productInCart } }).then(() => {
                        shoppingCartModel.findOne({ uid: cart.uid }).then((cartProducts) => {
                            const subTotal = cartProducts.products.map(product => (product.unit_price * product.quantity)).reduce((x, y) => { return (x + y) }).toFixed(2);
                            shoppingCartModel.updateOne({ uid: cart.uid }, { $set: { cart_total: subTotal } }).then(() => {
                                console.log(`new product information in cart is updated`);
                                console.log(`cart total is updated to ${subTotal}!`)
                                console.log(cartProducts);
                                genericMessage = `new product information in cart is updated`;
                                res.redirect(`/product/pid=${productInCart.pid}`)
                            })
                        })
                    });
                });
            }
        } else {
            cart.save()
                .then(() => {
                    productModel.findOne({ _id: cart.products[0].pid }).then((item) => {
                        const productInCart = {
                            pid: item._id,
                            quantity: cart.products[0].quantity,
                            unit_price: (item.price) ? item.price : 0,
                            name: item.name,
                            category: item.category,
                            image_url: item.image_url,
                            inventory: (item.quantity) ? item.quantity : 0,
                            unit_total: parseFloat(cart.products[0].quantity * item.price).toFixed(2)
                        }
                        console.log(`unit price is: ${productInCart.unit_price}; unit quantity is: ${productInCart.quantity}`);
                        shoppingCartModel.updateOne({ uid: cart.uid }, { $set: { products: productInCart } }).then(() => {
                            shoppingCartModel.findOne({ uid: cart.uid }).then((cartProducts) => {
                                const subTotal = cartProducts.products.map(product => (product.unit_price * product.quantity)).reduce((x, y) => { return (x + y) }).toFixed(2);
                                shoppingCartModel.updateOne({ uid: cart.uid }, { $set: { cart_total: subTotal } }).then(() => {
                                    console.log(`new user is created in shopping cart!`);
                                    genericMessage = `new user is created in shopping cart!`;
                                    console.log(`cart total is updated to ${subTotal}!`)
                                    console.log(cartProducts);
                                    res.redirect(`/product/pid=${productInCart.pid}`)
                                })
                            })

                        });
                    });
                })
                .catch(err => console.log(`Error happened when inserting in the database :${err}`));
        }
    }).catch(err => console.log(`${err}`));

})

router.post("/update", isRegularUserAuth, (req, res) => {
    let updatedCart = [];
    let allProductsIds = [];
    let allQuantities = [];
    shoppingCartModel.find({ uid: req.session.userInfo._id }).then((items) => {
        if (items) {
            let id = [];
            let quantity = [];
            if (Array.isArray(req.body.product_id)) {
                allProductsIds = req.body.product_id;
                allQuantities = req.body.purchased_quantity
            } else {
                allProductsIds.push(req.body.product_id);
                allQuantities.push(req.body.purchased_quantity);
            }
            console.log(`allProductsIds: ${allProductsIds} typeof ids is ${typeof allProductsIds}; allQuantities: ${allQuantities}`);
            allProductsIds.forEach((id) => {
                let idx = allProductsIds.indexOf(id);
                const quantity = req.body.purchased_quantity[idx];
                //updatedCart format: [{id:5e8fe4604c6f111908db6e3d,quantity:55},{id:5e8fe48c4c6f111908db6e3e,quantity:11}]
                updatedCart.push({ id: id, quantity: quantity });
            })
            productModel.find({ _id: { $in: allProductsIds } }).then((items) => {
                var productsInCart = items.map(item => {
                    return {
                        pid: item._id,
                        unit_price: (item.price) ? item.price : 0,
                        name: item.name,
                        category: item.category,
                        image_url: item.image_url,
                        inventory: (item.quantity) ? item.quantity : 0
                    }
                })
                allProductsIds.forEach((id) => {
                    let idx = allProductsIds.indexOf(id);
                    let quantity = allQuantities[idx];
                    const unit_price = productsInCart[idx].unit_price;
                    productsInCart[idx].quantity = Number(quantity);
                    productsInCart[idx].unit_total = Number(parseFloat(quantity * unit_price).toFixed(2));
                })
                console.log(productsInCart);
                const removeALlCartProducts = productsInCart.map((productInCart) => {
                    return shoppingCartModel.updateOne({ uid: req.session.userInfo._id }, { "$pull": { "products": { "pid": productInCart.pid } } }).then(() => {
                        console.log(`${productInCart.pid} is removed`)

                    })
                })
                Promise.all(removeALlCartProducts).then(() => {
                    const addBackAllCartProducts = productsInCart.map((productInCart) => {
                        return shoppingCartModel.findOneAndUpdate({ uid: req.session.userInfo._id }, { "$push": { "products": productInCart } }).then((cartProducts) => {
                            console.log(`${productInCart.pid} is added`)
                        });
                    });
                    Promise.all(addBackAllCartProducts).then(() => {
                        shoppingCartModel.findOne({ uid: req.session.userInfo._id }).then((cartProducts) => {
                            console.log(cartProducts);
                            const subTotal = cartProducts.products.map(product => product.unit_total).reduce((x, y) => { return (x + y) }).toFixed(2);
                            shoppingCartModel.updateOne({ uid: req.session.userInfo._id }, { $set: { cart_total: subTotal } }).then(() => {
                                console.log(`bulk update`);
                                res.redirect("/shoppingcart");
                            })
                        });
                    })

                })

            })
        }
        else {
            res.redirect('/shoppingcart');
        }
    }).catch(err => console.log(`${err}`));
})

router.get("/checkout", isRegularUserAuth, (req, res) => {
    let allProductsIds = [];    
    shoppingCartModel.findOneAndDelete({ uid: req.session.userInfo._id }).then((cartUserItem) => {       
        const userInfo = {
            name: req.session.userInfo.name,
            email: req.session.userInfo.email
        }       
        allProductsIds = cartUserItem.products.map(p => p.pid);
        productModel.find({ _id: { $in: allProductsIds } }).then((items) => {
            const productsInCart = items.map(item => {
                return {
                    id: item._id,
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    image_url: item.image_url
                }
            })
            allProductsIds.forEach((id) => {
                let idx = allProductsIds.indexOf(id);
                let quantity = Number(cartUserItem.products[idx].quantity);
                const unit_price = Number(parseFloat(cartUserItem.products[idx].unit_price).toFixed(2));
                productsInCart[idx].quantity = Number(cartUserItem.products[idx].quantity);
                productsInCart[idx].unit_total = Number(parseFloat(quantity * unit_price).toFixed(2));
            })
            const cartInfo = {
                cart_total: cartUserItem.cart_total,
                products: productsInCart
            }
            var listTemplate = "";
            cartInfo.products.forEach(element => {
                listTemplate += `<li>Product name:${element.name}; Product detail: ${element.description}; Unit purchased: X${element.quantity}; Item price: $${element.price}</li>`
            })
            const emailTemplate = `<h2>Dear ${userInfo.name}</h2>
            <p>You have purchased the following items in our store!</p>
            <ul>
                ${listTemplate}
            </ul>
            <br/>
            ------------------------
            <br/>
            Your subtotal is: $${cartInfo.cart_total}
            `
            console.log(emailTemplate);
            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
            const msg = {
                from: `${process.env.SENDER_EMAIL_ADDRESS}`,
                to: `${userInfo.email}`,
                subject: 'Receipt',
                html:emailTemplate,
            };
            sgMail.send(msg)
                .then(() => {
                    console.log(`Email sent!`)
                    res.render('product/confirmation')
                })
                .catch(err => {
                    console.log(`Error ${err}`);
                })
        })

    })
})

module.exports = router;


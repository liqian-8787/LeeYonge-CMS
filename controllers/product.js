/*********************PRODUCT ROUTES***************************/
const express = require('express')
const router = express.Router();
const path = require("path");
const productModel = require("../model/productSchema");
const isAuthenticated = require("../middleware/auth");
const isRegularUserAuth = require("../middleware/authRegularUser");
const productsWithAWSUrl = require("../model/awsSyncProduct");

//Route to direct use to Add Task form
router.get("/add", isAuthenticated, (req, res) => {
    res.redirect(`/products`);
});

//Route to process user's request and data when the user submits the add task form
router.post("/add", isAuthenticated, (req, res) => {
    const newProduct = {
        name: req.body.name,
        description: req.body.description,
        image_url: req.body.image_url,
        price: req.body.price,
        category: req.body.category,
        isBestSeller: req.body.isBestSeller,
        promotional_price: req.body.promotional_price,
        quantity: req.body.quantity,
        createdBy: req.session.userInfo.email,
        updatedBy: req.session.userInfo.email
    }

    const product = new productModel(newProduct);
    product.save()
        .then((item) => {

            req.session.addedProduct = item;
            req.session.generalMessage = [];
            req.files.productPic.name = `${req.session.userInfo._id}_${req.files.productPic.name}`;

            productsWithAWSUrl.uploadProductImage(req.files.productPic).then(() => {
                productModel.updateOne({ _id: item._id }, {//update image url by id
                    image_url: req.files.productPic.name
                }).then(() => {
                    res.redirect("/product/list");
                })
            })

        })
        .catch(err => console.log(`Error happened when inserting product in the database :${err}`));
});

router.get("/list", isAuthenticated, (req, res) => {
    productModel.find().then((products) => {
        productsWithAWSUrl.allProductsWithPresignedUrl(products).then(
            (refinedProducts) => {
                const allProducts = refinedProducts.map(product =>
                    ({
                        id: product._id,
                        name: product.name,
                        description: product.description,
                        image_url: product.image_url,
                        price: product.price,
                        category: product.category,
                        isBestSeller: product.isBestSeller,
                        promotional_price: product.promotional_price,
                        quantity: product.quantity
                    })
                )
                const allCategories = allProducts.map(product => {
                    return {
                        category: product.category
                    }
                })
                let currentOption = req.session.filterCategory;
                let allDistinctCategories = [... new Set(allCategories.map(item => item.category))];


                allDistinctCategories.push("All");

                if (typeof (req.session.filterCategory) == 'undefined') {
                    currentOption = "All";
                }

                /*Move select options*/
                if (allDistinctCategories.indexOf(currentOption) > 0) {
                    let index = allDistinctCategories.indexOf(currentOption);
                    allDistinctCategories.splice(index, 1);
                    allDistinctCategories.unshift(currentOption);
                }

                const searchedProducts = req.session.filterCategory == "All" || typeof (req.session.filterCategory) == 'undefined' ? allProducts : allProducts.filter(product => product.category == req.session.filterCategory)

                if (req.session.userInfo.role == "Clerk") {
                    res.render("product/operation", {
                        products: searchedProducts,
                        allDistinctCategories: allDistinctCategories,
                        userInfo: req.session.userInfo,
                        addedProduct: req.session.addedProduct,
                        generalMessage: req.session.generalMessage
                    });
                } else {
                    res.render("products", {
                        title: "Products",
                        headingInfo: "Products",
                        products: allProducts
                    });
                }
            })

    }).catch(err => console.log(`Error ${err}`));
})

router.get("/search", isAuthenticated, (req, res) => {
    res.redirect("/product/list");
})

router.post("/search", (req, res) => {
    req.session.filterCategory = req.body.product_category;
    req.session.addedProduct = [];
    req.session.generalMessage = [];
    res.redirect("/product/list");
})

//Route to product description
router.get("/pid=:id", isRegularUserAuth, (req, res) => { 
    productModel.findOne({ _id: req.params.id })
        .then((item) => {
            const product = {
                id: item._id,
                name: item.name,
                price: item.price,
                description: item.description,
                image_url: item.image_url
            }
            res.render("product/description", {
                product
            });
        })
        .catch(err => console.log(`${err}`));

})

router.put("/update/:id", (req, res) => {
    productModel.findById(req.params.id)
        .then((product) => {
            if (req.files) {
                req.files.productPic.name = `${req.session.userInfo._id}_${req.files.productPic.name}`;
                req.files.productPic.path = `/img/upload/${req.files.productPic.name}`;
                productsWithAWSUrl.uploadProductImage(req.files.productPic).then(() => {
                    const productInfo =
                    {
                        _id: product._id,
                        name: req.body.name,
                        price: req.body.price,
                        promotional_price: req.body.promotional_price,
                        description: req.body.description,
                        image_url: req.files.productPic.name,
                        category: req.body.category,
                        isBestSeller: req.body.isBestSeller,
                        quantity: req.body.quantity,
                        updatedBy: req.session.userInfo.email
                    }
                    productModel.updateOne({ _id: req.params.id }, productInfo)
                        .then(() => {
                            res.redirect("/product/list");
                            
                        })
                        .catch(err => console.log(`Error happened when updating data from the database :${err}`));

                });
            } else if (product.image_url) {
                const productInfo =
                {
                    _id: product._id,
                    name: req.body.name,
                    price: req.body.price,
                    promotional_price: req.body.promotional_price,
                    description: req.body.description,
                    image_url: product.image_url,
                    category: req.body.category,
                    isBestSeller: req.body.isBestSeller,
                    quantity: req.body.quantity,
                    updatedBy: req.session.userInfo.email
                }
               
                productModel.updateOne({ _id: req.params.id }, productInfo)
                    .then(() => {
                        res.redirect("/product/list");
                    })
                    .catch(err => console.log(`Error happened when updating data from the database :${err}`));


            } else {
                console.log(`need an image for the product!`)
            }
            if (product.image_url) {
                //productsWithAWSUrl.getImage(s3bucket)
            }

        })
        .catch(err => console.log(`Error happened when pulling from the database :${err}`));

});

router.delete("/delete/:id", (req, res) => {
    productModel.deleteOne({ _id: req.params.id })
        .then(() => {
            req.session.generalMessage = "A product has been deleted";
            req.session.addedProduct = [];
            res.redirect("/product/list");
        })
        .catch(err => console.log(`Error happened when updating data from the database :${err}`));
});


module.exports = router;
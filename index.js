const express = require("express"); //this imports the express package that was installed within your amazon application
const exphbs= require("express-handlebars");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload');

require('dotenv').config({path:"./config/keys.env"});


//load controller
const generalRoutes=require("./controllers/general");
const userRoutes=require("./controllers/user");
const productRoutes = require("./controllers/product");
const shoppingCartRoutes = require("./controllers/shoppingCart");

const amazon = express(); // this creates your express amazon object

amazon.use(bodyParser.urlencoded({extended:false}));

//This tells express to set up our template engine has handlebars
amazon.engine("handlebars",exphbs());
amazon.set("view engine", "handlebars");
amazon.use(express.static("public"));

/*
    This is to allow specific forms and/or links that were submitted/pressed
    to send PUT and DELETE request respectively!!!!!!!
*/
amazon.use((req,res,next)=>{

    if(req.query.method=="PUT")
    {
        req.method="PUT"
    }

    else if(req.query.method=="DELETE")
    {
        req.method="DELETE"
    }

    next();
})

amazon.use(fileUpload());

amazon.use(session({
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true
  }))

amazon.use((req,res,next)=>{
    res.locals.user= req.session.userInfo;
    next();
})


// map controller to the object
amazon.use("/",generalRoutes);
amazon.use("/user",userRoutes);
amazon.use("/product",productRoutes);
amazon.use("/shoppingcart",shoppingCartRoutes);

mongoose.connect(process.env.MONGO_DB_CONNECTION_ST, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`Connected to MongoDB Database`);
})
.catch(err=>console.log(`Error occured when connecting to database ${err}`));

// set up server
const PORT=process.env.PORT;

//This creates an Express Web Server that listens to incoming HTTP requests.
amazon.listen(PORT,()=>{
    console.log(`Web Server Started`);
});


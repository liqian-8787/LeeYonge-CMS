const express = require("express"); //this imports the express package that was installed within your leeyonge application
const exphbs= require("express-handlebars");
const Handlebars = require("handlebars");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
 
require('dotenv').config({path:"./config/keys.env"});


//load controller
const generalRoutes=require("./controllers/general");
const userRoutes=require("./controllers/user");
const productRoutes = require("./controllers/product");
const ordersRoutes = require("./controllers/orders");

const leeyonge = express(); // this creates your express leeyonge object

leeyonge.use(bodyParser.urlencoded({extended:false}));

//This tells express to set up our template engine has handlebars
leeyonge.engine('handlebars', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

leeyonge.set("view engine", "handlebars");
leeyonge.use(express.static("public"));

/*
    This is to allow specific forms and/or links that were submitted/pressed
    to send PUT and DELETE request respectively!!!!!!!
*/
leeyonge.use((req,res,next)=>{

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

leeyonge.use(fileUpload());

leeyonge.use(session({
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true
  }))

leeyonge.use((req,res,next)=>{
    res.locals.user= req.session.userInfo;
    next();
})


// map controller to the object
leeyonge.use("/",generalRoutes);
leeyonge.use("/user",userRoutes);
leeyonge.use("/product",productRoutes);
leeyonge.use("/orders",ordersRoutes);

mongoose.connect(process.env.MONGO_DB_CONNECTION_ST, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`Connected to MongoDB Database`);
})
.catch(err=>console.log(`Error occured when connecting to database ${err}`));

// set up server
const PORT=process.env.PORT;

//This creates an Express Web Server that listens to incoming HTTP requests.
leeyonge.listen(PORT,()=>{
    console.log(`Web Server Started`);
});


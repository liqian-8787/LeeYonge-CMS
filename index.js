const express = require("express"); //this imports the express package that was installed within your application
const exphbs= require("express-handlebars");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

require('dotenv').config({path:"./config/keys.env"});

//load controller
const generalRoutes=require("./controllers/general");
const userRoutes=require("./controllers/user");


const amazon = express(); // this creates your express amazon object

amazon.use(bodyParser.urlencoded({extended:false}));

//This tells express to set up our template engine has handlebars
amazon.engine("handlebars",exphbs());
amazon.set("view engine", "handlebars");
amazon.use(express.static("public"));
amazon.use(fileUpload());

// map controller to the object
amazon.use("/",generalRoutes);
amazon.use("/user",userRoutes);


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
const express = require("express"); //this imports the express package that was installed within your application
const exphbs= require("express-handlebars");
const bodyParser = require('body-parser');
require('dotenv').config({path:"./config/keys.env"});

const amazon = express(); // this creates your express amazon object

amazon.use(bodyParser.urlencoded({extended:false}));

//This tells express to set up our template engine has handlebars
amazon.engine("handlebars",exphbs());
amazon.set("view engine", "handlebars");
amazon.use(express.static("public"));

//load controller
const generalController=require("./controllers/general");
// map controller to the object
amazon.use("/",generalController);

// set up server
const PORT=process.env.PORT;
//This creates an Express Web Server that listens to incoming HTTP requests.
amazon.listen(PORT,()=>{
    console.log(`Web Server Started`);
});
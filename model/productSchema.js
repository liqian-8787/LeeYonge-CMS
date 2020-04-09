const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({

    name:
    {
        type:String,
        required:true

    },

    description:
    {
        type:String,
        required:true
    },

    image_url:{

    },

    price:
    {
        type:String,
        required:true
    },

    category:
    {
        type:String,
        required:true
    },

    isBestSeller:
    {
        type:String,
        required:false
    }
});


const productModel = mongoose.model('Products', productSchema);

module.exports = productModel;

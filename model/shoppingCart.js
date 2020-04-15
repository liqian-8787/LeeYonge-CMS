const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shoppingCart = new Schema({

    uid:
    {
        type:String,
        required:true
    },
    products:    
    [
        {
            pid: {type:String},
            unit_price:{type:Number},
            quantity:{type:Number},
            unit_total:{type:Number}
        }
    ],
    cart_total:{
        type:Number,
        default:0
    }
    
});

const shoppingCartModel = mongoose.model('ShoppingCart', shoppingCart);

module.exports = shoppingCartModel;

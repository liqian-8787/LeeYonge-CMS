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
            quantity:{type:Number}
        }
    ]
    
});

const shoppingCartModel = mongoose.model('ShoppingCart', shoppingCart);

module.exports = shoppingCartModel;

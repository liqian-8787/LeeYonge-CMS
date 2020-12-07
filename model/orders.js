const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderHistorySchema = new Schema({

    uid:
    {
        type: String,
        required: true
    },
    customerInfo: {
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String }
    },
    orders: [{
        cart_total: { type: Number },
        products: [{
            id: { type: String },
            name: { type: String },
            image_url: { type: String },
            price: { type: Number },
            promotional_price: { type: Number },
            description: { type: String },
            quantity: { type: Number },

        }],
        updatedBy: {
            type: String,
            default: ""
        },
        isCancelled:
        {
            type: Boolean,
            default: false
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        isPickedUp: {
            type: Boolean,
            default: false
        },
        date: { type: Date }
    }]
});

const ordersModel = mongoose.model('orderhistories', orderHistorySchema);

module.exports = ordersModel;

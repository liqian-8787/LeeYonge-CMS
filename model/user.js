const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchma = new Schema({

    name:
    {
        type:String,
        required:true

    },

    email:
    {
        type:String,
        required:true
    },

    password:
    {
        type:String,
        required:true
    },

    passwordConfirm:
    {
        type:String,
        required:true
    }
});


    









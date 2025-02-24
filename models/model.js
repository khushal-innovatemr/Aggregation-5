const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    _id:{type:Number,required:true},
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
});

const Product = mongoose.model('Products', ProductSchema);

module.exports = Product;

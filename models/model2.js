const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
    _id:{type:Number,required:true},
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    Quantity_Sold:{type:Number,required: true},
});

const Products = mongoose.model('Shop', ProductsSchema);

module.exports = Products;

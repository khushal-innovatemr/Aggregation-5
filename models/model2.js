const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
    _id:{type:Number,required:true},
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantitySold:{type:Number,required: true},
    tags:{type:Array,required:true},
    lastSaleDate:{type:Date,required:true},
    region:{type:Array,required:true}   
});

const Products = mongoose.model('Items', ProductsSchema);

module.exports = Products;

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    productId:{type:Number,required:true},
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
});

const Reviews = mongoose.model('Review', ReviewSchema);

module.exports = Reviews;

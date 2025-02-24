const mongoose  = require('mongoose');
const express = require('express');
const Product = require('./models/model');
const Products = require('./models/model2');
const app = express();
const port = 3194;
app.use(express.json());

mongoose.connect('mongodb://localhost:27017',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

app.post('/add-Product',async(req,res) => {
    try{
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.send('Product Saved Successfully')
    }
    catch(error){
        res.status(500).send("Error Saving user");
        console.log(error);
    }
})

// app.post('/add-Products',async(req,res) => {
//     try{
//         const products = req.body; 
//         await Products.insertMany(products);
//         res.send('Products Saved Successfully');
//     }
//     catch(error){
//         res.status(500).send("Error Saving user");
//         console.log(error);
//     }
// })

app.post('/',async(req,res) => {
    try{
        const products = req.body; 
        await Products.insertMany(products);
        res.send('Products Saved Successfully');
    }
    catch(error){
        res.status(500).send("Error Saving user");
        console.log(error);
    }
})


app.get('/aggregation-products',async(req,res) => {
    try{
        const Products = await Product.aggregate([
            {
              $group: {
                _id: "$category",
                total_items: {
                  $sum: 1,
                },
              },
            },
          ])
    res.send(Products);
    console.log(Products);
    }
    catch(error){
        console.log(error,"Tum Galat Ho")
    }  
})

app.listen(3194, () => {
    console.log(`Server is running on port "http://localhost:${port}`);
});





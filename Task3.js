const mongoose  = require('mongoose');
const express = require('express');
const Products = require('./models/model2');
const Reviews = require('./models/model');
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
        // const newProduct = new Products(req.body);
        await Products.insertMany(req.body);
        res.send('Product Saved Successfully')
    }
    catch(error){
        res.status(500).send("Error Saving user");
        console.log(error);
    }
})

app.post('/add-Review',async(req,res) => {
    try{
        await Reviews.insertMany(req.body);
        res.send('Review Saved Successfully')
    }
    catch(error){
        res.status(500).send("Error Saving Review");
        console.log(error);
    }
})



// app.post('/add-Products',async(req,res) => {
//     try{
//         const products = req.body
//         await Products.save();
//         await Products.insertMany(products);
//         res.send('Products Saved Successfully');
//     }
//     catch(error){
//         res.status(500).send("Error Saving user");
//         console.log(error);
//     }
// })



app.get('/aggregation-products',async(req,res) => {
    try{
        const Products_1 = await Products.aggregate([
            {
              $group: {
                _id: "$category",
                total_items: {
                  $sum: 1,
                },
              },
            },
            {
              $project:{
                  category:"$_id",
                  total_items:1,
                  _id:0
              }
            }
          ])
    res.send(Products_1);
    console.log(Products_1);
    }
    catch(error){
        console.log(error,"Tum Galat Ho")
    }  
})

app.get('/products',async(req,res) => {
    try{
        const Products_1 = await Products.aggregate([
            {
                $match: {
                  price: {
                    $gt: 50,
                  },
                },
              },
              {
                $group: {
                  _id: "$category",
                  totalSales: {
                    $sum: {
                      $multiply: ["$price", "$quantitySold"],
                    },
                  },
                },
              },
              {
                $sort: {
                  totalSales: -1,
                },
              },
              {
                $project: {
                  category: "$_id",
                  totalSales: 1,
                  _id: 0,
                },
              },  
          ])
    res.send(Products_1);
    console.log(Products_1);
    }
    catch(error){
        console.log(error,"Tum Galat Ho")
    }  
})

app.get('/avg',async(req,res) => {
    try{
        const Products_1 = await Products.aggregate([
                    {
                      $group: {
                        _id: "$category",
                        avg: {
                          $avg: "$price",
                        },
                        count: {
                          $sum: 1,
                        },
                      },
                    },
                    {
                      $match: {
                        count: {
                          $gte: 5,
                        },
                      },
                    },
                    {
                      $sort: {
                        avg: -1,
                      },
                    },
                    {
                      $limit: 3,
                    },
                    {
                      $project: 
                        {
                          Average_Price:
                          {
                            $round:[ "$avg", 2] ,
                          }
                        },
                    },
                    {
                      $project: {
                        category: "$_id",
                        Average_Price:1,
                        _id:0
                      }
                    }
                  ])
    res.send(Products_1);
    console.log(Products_1);
    }
    catch(error){
        console.log(error,"Tum Galat Ho")
    }  
})

app.get('/date',async(req,res) => {
    try{
        const Products_1 = await Products.aggregate([
            {
              $match: {
                lastSaleDate: {
                  $gte: new Date("2024-01-01"),
                  $lt: new Date("2024-12-31"),
                },
              },
            },
            {
              $unwind: "$tags",
            },
            {
              $group: {
                _id: "$tags",
                Product_Count: {
                  $sum: 1,
                },
                Total_Sold: {
                  $sum: "$quantitySold",
                },
              },
            },
            {
              $match: {
                _id: "luxury",
              },
            },
            {
              $project: {
                Special_Tag:"$_id",
                Product_Count:1,
                Total_Sold:1,
                _id:0
              }
            }
          ])
    res.send(Products_1);
    console.log(Products_1);
    }
    catch(error){
        console.log(error,"Tum Galat Ho")
    } 
})

app.get('/revenue',async(req,res) => {
  try{
      const Products_1 = await Products.aggregate(
        [
          {
            $unwind: "$region",
          },
          {
            $group: {
              _id: "$_id",
              name: {
                $first: "$name",
              },
              price: {
                $first: "$price",
              },
              quantitySold: {
                $first: "$quantitySold",
              },
              region_count: {
                $sum: 1,
              },
              regions: {
                $push: "$region",
              },
            },
          },
          {
            $match: {
              region_count: {
                $gt: 2,
              },
            },
          },
          {
            $lookup: {
              from: "reviews",
              localField: "_id",
              foreignField: "productId",
              as: "reviews",
            },
          },
          {
            $unwind: "$reviews",
          },
          {
            $group: {
              _id: "$_id",
              region_count: {
                $first: "$region_count",
              },
              name: {
                $first: "$name",
              },
              regions: {
                $first: "$regions",
              },
              Revenue: {
                $first: {
                  $multiply: ["$price", "$quantitySold"],
                },
              },
              avg_rating: {
                $avg: "$reviews.rating",
              },
            },
          },
          {
            $sort: {
              Revenue: -1,
            },
          },
          {
            $limit: 5,
          },
          {
            $project: {
              name: 1,
              Revenue: 1,
              avg_rate: {
                $avg: "$avg_rating",
              },
              region_count:1 ,
            },
          },
        ]
      
      )
  res.send(Products_1);
  console.log(Products_1);
  }
  catch(error){
      console.log(error,"Tum Galat Ho")
  } 
})



app.listen(3194, () => {
    console.log(`Server is running on port "http://localhost:${port}`);
});






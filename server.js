const express = require('express')
const app = express()
const cors = require('cors')
const ObjectID = require('mongodb').ObjectID;
const mongodb = require('mongodb');
const { MongoClient, Db } = require('mongodb')
app.use(cors())
app.use(express.json())
const bodyparser = require('body-parser')

const mongoclient = require('mongodb').MongoClient
mongoclient.connect('mongodb://localhost:27017', (err, client) => {


    if (err) {
        console.log('failed to establish connection..')
    }
    var db = client.db('ecomdb')
    console.log('connection established..')

    app.listen(2000, () => {
        console.log('server started at port 2000..')
    })
    app.get('/', (req, res) => {
        res.send("GET Request Called")
    })

    app.get('/orders',(req,res)=>{
        
            db.collection("orders").find({}).toArray((err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(result);
                    
                }
            });
    })

    app.post('/placeorder', (req, res) => {
        console.log(req.body);
        const data={
            "address":req.body.address,
            "cartdata":req.body.cartdata,
            "quantityarray":req.body.quantityarray,
            "email":req.body.email,
            "price":req.body.price,
            
        } 
        
            db.collection("orders").insertOne(data, (err, req) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Order placed');
                    res.send('Order placed')
                }
            });
        

    })

    //add new products
    app.post('/add-new-product', (req, res) => {
        // console.log(req.body);
      
        db.collection("products").countDocuments({}, function(err, count) {
            
            const data={
                "pid":Math.floor((Math.random() * 100) + 1),
                "name":req.body.name,
                "category":req.body.category,
                "description":req.body.description,
                "price":req.body.price,
                "imageurl":req.body.imageurl,
            } 
            
            db.collection("products").insertOne(data, (err, req) => {
                if (err) {
                    console.log(err);
                    res.send(err)
                }
                else {
                    res.send('Product added successfully');
                }
            });


        });
       
       


        
    })

    // display products
    app.get('/products', (req, res) => {

        db.collection("products").find({}).toArray((err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
                
            }
        });
    })


    // delete product

    app.delete('/delete-product/:id', (req, res) => {
        const pid=Number(req.params.id)
       db.collection("products").deleteOne({ 'pid':pid }, (err, obj) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                console.log('Deleted')
                res.send('Product deleted successfully');
            }
        });
    })


})
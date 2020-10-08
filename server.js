/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Clint Sheppard______ Student ID: 192292190_____ Date: A week late ____
* Heroku Link: https://clint-salesapi.herokuapp.com
*
********************************************************************************/

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const exhbs = require("express-handlebars");
const dataService = require("./modules/data-service.js");

require('dotenv').config({path:"./config/keys.env"});
const MONGOSTRING = process.env.MONGOO;
const HTTP_PORT = process.env.PORT || 8080;

const myData = dataService(`mongodb+srv://clint:${MONGOSTRING}@cluster0.qvzq8.mongodb.net/sample_supplies?retryWrites=true&w=majority`);

const app = express();

app.engine('hbs', exhbs());
app.set('view engine', 'hbs');
app.use(cors());
app.use(bodyParser.json());

// ************* API Routes

// POST /api/sales (NOTE: This route must read the contents of the request body)
app.post("/api/sales", (req,res)=>{
    myData.addNewSale(req.body).then((newSale)=>{
        res.send(`Success! Added ${newSale._id}`);
    }).catch((err)=>{
        res.send(err);
    });
});


// GET /api/sales (NOTE: This route must accept the numeric query parameters "page" and "perPage", ie: /api/sales?page=1&perPage=5 )
app.get("/api/sales", (req,res)=>{
    var salesArray = [];
    myData.getAllSales(req.query.page, req.query.perPage).then((sales)=>{
        for(x of sales){
            salesArray.push(x);
        }
    }).then(()=>{
        res.send(salesArray);
    });
});


// GET /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.get("/api/sales/:id", (req,res)=>{
    myData.getSaleById(req.params.id).then((sale)=>{
        res.send(sale);
    });
});


// PUT /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8 as well as read the contents of the request body)
app.put("/api/sales/:id", (req,res)=>{
    console.log(`updating sale for ID ${id}`);
    myData.updateSalesById(req.body, req.query.id);
});


// DELETE /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.delete("/api/sales/:id", (req,res)=>{
    console.log("delete called on " + req.query.id);
    myData.deleteSaleById(req.query.id).then(()=>{
        //
    }).catch(err =>{
        console.log(err);
        res.send(err);
    });
});


// ************* Initialize the Service & Start the Server

myData.initialize().then(()=>{
    app.listen(HTTP_PORT,()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});


//jshint esversios:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose"); 

const app = express();


// I comment it out because of now i am going to use mongoose
// let items = ["Buy Food", "Cook Food", "Eat Food"];
// let workItem = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs"); 

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
    name: String
};

const Item = mongoose.model( "Item", itemsSchema);

const item1 = new Item({
    name : "Welcome to todo list"
});
const item2 = new Item({
    name : "Hit the + button to add a new item"
});
const item3 = new Item({
    name : "<-- Hit this to delete an item>"
});

const defaultItems = [ item1, item2, item3]; 



app.get("/", function(req, res){
    // res.write("Hello");

    // var today = new Date();
    // var options = {
    //     weekday: "long" ,
    //     day: "numeric",
    //     month: "long",
    // };

    // var day = today.toLocaleDateString("en-US", options);

    // let day = date();

    Item.find()
      .then(function (results) {   

        if(results.length === 0) {
            Item.insertMany(defaultItems)
                .then(function () {
                    console.log("Successfully saved defult items to DB");
                })
                .catch(function (err) {
                    console.log(err);
                });
                res.redirect("/");
        }else{
            res.render("list", {listTitle: "Today", newItem: results}); 
        }

        
      })
      .catch(function (err) {
        console.log(err);
      });

    
    
});


app.post("/", function(req, res){
    let item = req.body.newItem;
    
    if(req.body.list == "Work"){
        workItem.push(item);
        res.redirect("/work");
    }else{
        items.push(item);
        res.redirect("/");
    }
    // items.push(item);
    // res.redirect("/");
});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", newItem: workItem});
});

app.listen(3000, function(){
    console.log("Server is started on port 3000");
});
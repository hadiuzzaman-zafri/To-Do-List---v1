//jshint esversios:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose"); 
const _ = require("lodash");

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

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema )

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

app.get("/:customListName", function(req, res){

    const customListName = _.capitalize(req.params.customListName);
 
    List.findOne({name: customListName})
        .then(function(foundList){
            
            if(!foundList){
                //create new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName );  
            }else{
                //show an existing list
                res.render("list", {listTitle: foundList.name, newItem: foundList.items}); 
            }
    
        })
        .catch(function(err){
            console.log(err);
        });

    const list = new List({
        name: customListName,
        items: defaultItems
    });
    list.save();

});


app.post("/", function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName 
    });

    if(listName == "Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName})
            .then(function(foundList){ 
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            })
            .catch(function(err){
                console.log(err); 
            });

    }
    

    // if(req.body.list == "Work"){
    //     workItem.push(item);
    //     res.redirect("/work");
    // }else{
    //     items.push(item);
    //     res.redirect("/");
    // }
    // items.push(item);
    // res.redirect("/");
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if( listName === "Today"){
        Item.findByIdAndDelete(checkedItemId)
            .then(function(){
                console.log("Successfully item deleted from DB");
            }) 
            .catch(function(err){
                console.log(err);
            });
            res.redirect("/");
    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id : checkedItemId}}})
            .then(function(foundList){
                res.redirect("/" + listName);
            })
            .catch(function(err){
                console.log(err);
            });
    }

     
});

// app.get("/work", function(req, res){
//     res.render("list", {listTitle: "Work List", newItem: workItem});
// });

app.listen(3000, function(){
    console.log("Server is started on port 3000");
}); 
//jshint esversios:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItem = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs"); 

app.get("/", function(req, res){
    // res.write("Hello");

    // var today = new Date();
    // var options = {
    //     weekday: "long" ,
    //     day: "numeric",
    //     month: "long",
    // };

    // var day = today.toLocaleDateString("en-US", options);

    let day = date();

    res.render("list", {listTitle: day, newItem: items});
    
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
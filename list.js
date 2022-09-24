const express = require("express");

const date = require(__dirname + "/views/date.js");

const _ = require("lodash")

const app = express();

const mongoose = require("mongoose");

app.set('view engine', 'ejs');

const bodyParser = require("body-parser");
const {
    urlencoded
} = require("body-parser");

  app.use(express.static("public"));

  app.use(bodyParser.urlencoded({
    extended: true
}));

const request = require("request");

mongoose.connect("mongodb+srv://admin-fardeen:hello123@shots1.fffjlvo.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useFindAndModify', false);

const itemsSchema = {
    name: {
        type: String,
        required: [false, "Add your Task First"]
    }
}
const Item = mongoose.model("item", itemsSchema);

const work1 = new Item({
    name: "Welcome to your ToDoList"
})

const work2 = new Item({
    name: "Hit the + button to add a new item"
})

const work3 = new Item({
    name: "<-- Hit this to delete an item"
})

const addItems = [work1, work2, work3]

const customSchema = {
    name: String,
    items: [itemsSchema]
}

const listName = mongoose.model("list", customSchema);

let time = date.getTime();

app.get("/", function (req, res) {

    //  let day=date.getDate();   

    Item.find({}, function (err, foundItems) {

        if (foundItems.length === 0) {

            Item.insertMany(addItems, function (err) {

                if (err) {
                    console.log(err)
                } else {
                    console.log("Succesfully saved the data to toDoListDB");
                }
            })
            res.redirect("/")
        } else {

            res.render("list", {
                workList: "Today",
                listItems: foundItems,
                localTime: time
            });
        }
    })
});

app.post("/", function (req, res) {

    const itemName = req.body.NextItem;
    const dynamicList = req.body.list;

    const item = new Item({
        name: itemName
    })

    if (dynamicList === "Today") {

        item.save();
        res.redirect("/");
    } else {
        listName.findOne({
            name: dynamicList
        }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + dynamicList)
        });
    }


});



// if(req.body.list==="Work"){
//  works.push(item);
//  res.redirect("/work");
// } 

// else{

// items.push(item);
// res.redirect("/");
// }
//});

app.post("/del", function (req, res) {

    const deletedId = req.body.deletedItem

    const deleteList = req.body.delList;

    if (deleteList === "Today") {

        Item.findByIdAndRemove(deletedId, function (err) {
            if (!err) {
                console.log("SuccesFully Deleted the Checked Item")

            }
            res.redirect("/")
        })

    } else {
        listName.findOneAndUpdate({
            name: deleteList
        }, {
            $pull: {
                items: {
                    _id: deletedId
                }
            }
        }, function (err, foundList) {
            if (!err) {
                res.redirect("/" + deleteList);
                
            }
        })
    }
})
app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName)

    listName.findOne({
        name: customListName
    }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new listName({
                    name: customListName,
                    items: addItems
                })
                list.save();
                res.redirect("/" + customListName)
            } else {
                res.render("list", {
                    workList: foundList.name,
                    listItems: foundList.items,
                    localTime: time
                })
            }
        }

    })
})
// app.get("/work", function (req, res) {


//     res.render("list", {
//         workList: "Work List",
//         listItems: works,
//         localTime: time
//     });

// });

let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}


app.listen(port, function () {
    console.log("Server is successfully connected ");
});
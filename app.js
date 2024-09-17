//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const itemsSchema = {
    name: String
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
    name: "Welcome to TaskTango"
});
const item2 = new Item({
    name: "Hit the Enter or Add Task button to add a new item"
});
const item3 = new Item({
    name: "Hit this to edit/delete an item -->"
});
const defaultItems = [item1, item2, item3];

app.get('/', (req, res) => {
    Item.find({}).then(function (foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems);
            res.redirect('/');
        } else {
            res.render("list", {newListItems: foundItems });
        }
    });
});

app.post('/', (req, res) => {
    const itemName = req.body.newItem;
    const taskId = req.body.taskId;

    // Check if taskId exists; if so, it's an update
    if (taskId) {
        Item.findByIdAndUpdate(taskId, { name: itemName }).then(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Updated successfully");
            }
            res.redirect('/');
        });
    } else {
        // If taskId doesn't exist, create a new task
        const newItem = new Item({
            name: itemName
        });
        newItem.save();
        res.redirect('/');
    }
});

app.post('/delete', (req, res) => {
    const taskId = req.body.taskId;

    Item.findByIdAndDelete(taskId).then(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Deleted Successfully");
        }
        res.redirect('/');
    });
});

app.listen(process.env.PORT||5050, function () {
    console.log('Server is running on port 5050');
});

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require('lodash');

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-mann:poiuytrewq@cluster0.hx5es3q.mongodb.net/todoListDB", {
  useNewUrlParser: true
});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const listSchema = {
  listName: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Eat"
});

const item2 = new Item({
  name: "Sleep"
});

const item3 = new Item({
  name: "Code"
});

const defaultItems = [item1, item2, item3];

const day = date.getDay();

app.get('/', (req, res) => {

  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Success!");
        }
      });
    } else {
      res.render("list", {
        listTitle: day,
        newListItems: foundItems
      });
    }
  })

});

app.post('/', (req, res) => {

  const itemName = req.body.item;
  const listName = req.body.button;

  const item = new Item({
    name: itemName
  });

  if (listName === day) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });

  }

});

app.post("/delete", (req, res) => {

  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === day) {
    Item.findByIdAndRemove(checkedItemID, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({
      listName: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemID
        }
      }
    }, (err, foundList) => {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({
    listName: customListName
  }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        // Create a New list
        const list = new List({
          listName: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        // Show an existing list
        res.render("list", {
          listTitle: foundList.listName,
          newListItems: foundList.items
        });
      }
    }
  });

});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server is Running on port 3000");
});

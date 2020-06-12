require('dotenv').config();// from npm dotdev requirement
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();


mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
app.set("view engine", "ejs");


console.log(process.env.AUTHER_EXEMPLE);//FOR PRINT some variables from the .env file

// const userSchema = {// this was in level 1
const userSchema = new mongoose.Schema({//this is for level 2 and this Schema its a class from mongoose
  email: String,
  password: String
});

// const secret = "Thisisourlittlesecret.";// we cut it and post in .env file and there for mat it for .env format
userSchema.plugin(encrypt,{secret:process.env.SECRET  ,encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);


app.get("/", function(req, res) {
  res.render("home")
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register")
});

app.post("/register", function(req, res) {

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if (!err) {
      console.log("i was here");
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.post("/login", function(req, res) {



  User.findOne({
    email: req.body.username
  }, function(err, userFound) {
    if (!err) {
      if (userFound) {
        if (userFound.password === (req.body.password)) {
          res.render("secrets");
        } else {
          res.redirect("/");
        }
      }else{
        res.redirect("/login");
      }
    } else {
      //console.log("it was here");
      console.log(err);
    }
  });
});









app.listen(3000, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("server run on 3000");
  }
})

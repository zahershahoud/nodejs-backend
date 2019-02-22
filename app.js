const express = require("express");
const app = express();
// template engine for show the views/design
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
// adding mongoose library
const mongoose = require("mongoose");
// connect with database
mongoose.connect("mongodb://admin:admin123@ds113454.mlab.com:13454/fbw3");

// add model
const User = require("./models/user");
const Book = require("./models/book");

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(express.static(path.join(__dirname, "public")));
// setup template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// routes
// landing page: localhost:5000/
app.get("/", (request, response) => {
  // response.send('This is my landing page');
  response.render("index", {
    pageTitle: "Landing page"
  }); //index.hbs and layout.hbs
});

// get registration form
app.get("/registration", (request, response) => {
  response.render("signUp", {
    pageTitle: "Registration Page"
  }); //signUP.hbs and layout.hbs
});

app.post("/registration", (req, res) => {
  // if any data come from the form than render to success
  console.log(req.body);

  let newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    website: req.body.website
  });
  // save data into database
  newUser.save(err => {
    if (err) throw err;
    res.redirect("/login");
  });

  //response.json(req.body.username);
});

// login form routes
app.get("/login", (req, res) => {
  // render the log-in form
  res.render("login");
});

app.post("/login", (req, res) => {
  console.log(req.body);
  /**
   * if users is empty or not in database we will go to registration page
   * else the user will see profile
   */
  let emailFromBody = req.body.email;
  if (emailFromBody) {
    // find the user
    let users = User.findOne({
      email: emailFromBody
    });
    // execute the users query
    users.exec((err, result) => {
      if (err) throw err;
      console.log(result);
      if (!result) {
        res.redirect("/registration");
        //res.send('wrong email address! Please put the right one');
      } else {
        res.render("profile", {
          email: result.email,
          username: result.username,
          password: result.password,
          website: result.website,
          pageTitle: "My Profile Page"
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

// CRUD application
/*
 C: create something and save 
 R: read data from the database and show it
 U: update data you have in database
 D: delete data from database
 */
// find all my users from database
app.get("/book", (req, res) => {
  res.render("bookForm", {
    pageTitle: "My BookStore Form"
  });
});
// Create a BookStore and save to Mlab/mongodb

app.post("/book/add", (req, res) => {
  console.log(req.body);
  let newBook = new Book({
    title: req.body.title,
    writter: req.body.writter,
    yearOfPublich: req.body.yearOfPublich,
    price: req.body.price,
    createdAt: Date()
  });
  newBook.save(() => {
    res.redirect("/book/list");
  });
});
app.all("/book/list", (req, res) => {
  // find all books
  const query = Book.find();
  if (req.body.writter) {
    query.where({
      writter: req.body.writter
    });
  }
  query.exec((err, result) => {
    console.log(result);

    res.render("bookList", {
      pageTitle: "All Books List",
      books: result
    });
  });
});

app.get("/book/update/:id", (req, res) => {
  let bookId = req.params.id;
  //res.send("Book Id I clicked is:" + bookId);
  const query = Book.findById({ _id: bookId });
  query.exec((err, result) => {
    // res.json(result);
    res.render("bookDetail", {
      pageTitle: "Book Details",
      mybook: result
    });
  });
});

app.post("/book/update", (req, res) => {
  const query = Book.findById({ _id: req.body.id });
  query.exec((err, result) => {
    if (err) throw err;
    result.title = req.body.title;
    result.writter = req.body.writter;
    result.yearOfPublich = req.body.yearOfPublich;
    result.price = req.body.price;
    result.updateAt = Date.now();
    result.save(() => {
      res.redirect("/book/list");
    });
  });
});

app.post("/book/search", (req, res) => {
  let writter = req.body.writter;
  console.log(writter);
  const searchQuery = Book.findOneAndUpdate();
  searchQuery.where({
    writter: writter
  });
  searchQuery.exec((err, result) => {
    res.json(result);
  });
});

app.get("/book/delete/:id", (req, res) => {
  let bookId = req.params.id;
  //res.send("Book Id I clicked is:" + bookId);
  const query = Book.findByIdAndRemove({ _id: bookId });
  query.exec((err, result) => {
    res.redirect("/book/list");
  });
});

// localhost:5000/users
app.get("/users", (req, res) => {
  /* let users = [
    {
        name: "Ariful",
        age: 28,
        role: "teacher",
        id: 1
    },
    {
        name: "Gabi",
        age: 30,
        role: "Student",
        id: 2
    }
   ]; */
  // getting users list from some website
  let getUsers = fetch("https://jsonplaceholder.typicode.com/users");
  getUsers
    .then(res => res.json())
    .then(users => {
      res.render("userList", {
        pageTitle: "All users list",
        users: users //some data about users
      });
    });

  //res.send('Hi Users routes is working');
});

// localhost:5000/user/1
app.get("/user/:id", (req, res) => {
  let userId = req.params.id;
  console.log(req.params);
  let findUser = fetch("https://jsonplaceholder.typicode.com/users/" + userId);
  findUser
    .then(res => res.json())
    .then(user => {
      res.render("profile", {
        pageTitle: "All users list",
        user: user
      });
    });
  //res.send('One user with Id ' + userId);
});

// gabis routes
app.get("/gabi", (req, res) => {
  let gabi = "Gabi";
  res.render("index", {
    name: gabi,
    pageTitle: "Hi everyone"
  });
});

// lovely
app.get("/lovely", (req, res) => {
  //res.send('Hi I am Lovely wagemann');
  //res.sendFile(__dirname + '/gabi.html');
});

// anas
app.get("/anas", (req, res) => {
  let user = {
    name: "ANAS",
    age: 23,
    country: "Syria"
  };
  res.send("Hi" + JSON.stringify(user));
});

// localhost:5000/zaher/123
// zaher
app.get("/zaher/:id", (req, res) => {
  res.send(" Hi I am zaher with Id: " + req.params.id);
});

// localhost:5000/ali/friends/123
app.get("/ali/:friend/:id", (req, res) => {
  res.send(
    "I am Ali and my friend is: " + req.params.friend + " id: " + req.params.id
  );
});

app.get("/gallery", (req, res) => {
  res.render("gallery", {
    pageTitle: "My Gallery Page"
  });
});
/* app.get("*", (req, res) => {
  res.redirect("/"); //if no routes than go to homepage
}); */

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("This app is running on port " + PORT);
});

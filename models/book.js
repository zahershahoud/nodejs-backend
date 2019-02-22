// add mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  writter: String,
  yearOfPublich: String,
  price: String,
  createdAt: Date,
  updateAt: Date
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book; // model is available to use

// add mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  username: {
    firstName: String,
    lastName: String
  },
  address: {
    street: String,
    zip: Number,
    city: String,
    country: String
  },
  password: String,
  website: String
});

const User = mongoose.model("User", userSchema);

module.exports = User; // model is available to use

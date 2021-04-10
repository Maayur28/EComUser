const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require('dotenv').config();

const url =process.env.URL;
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
const userSchema = mongoose.Schema({
  userid: {
    type: String,
    required: [true, "userid is required"],
    unique: true,
  },
  firstname: { type: String, required: [true, "FirstName is required"] },
  lastname: { type: String, required: [true, "LastName is required"] },
  username: {
    type: String,
    required: [true, "UserName is required"],
    unique: true,
  },
  password: { type: String, required: [true, "Password is required"] },
});

let connection = {};
connection.getUserConnection = async () => {
  try {
    let dbConnection = await mongoose.connect(url, options);
    let model = dbConnection.model("User", userSchema, "users");
    return model;
  } catch (error) {
    let err = new Error("Could not establish connection with user database");
    err.status = 500;
    throw err;
  }
};
module.exports = connection;

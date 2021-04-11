const model = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const validator = require("../utilities/validate");
require("dotenv").config();
let userService = {};

userService.LoginUser = async (obj) => {
  if (validator.LoginUser(obj)) {
    const getLogin = await model.LoginUser(obj);
    return jwt.sign(_.pick(getLogin, ["userid"]), process.env.TOKEN_SECRET);
  } else {
    let err = new Error();
    err.status = 400;
    err.message =
      "Invalid credentials,Please check the credentials and try again";
    throw err;
  }
};
userService.RegisterUser = async (Obj) => {
  Obj.userid = uuidv4();
  const userObj = _.pick(Obj, [
    "userid",
    "firstname",
    "lastname",
    "username",
    "password",
  ]);
  userObj.password = await bcrypt.hash(
    userObj.password,
    await bcrypt.genSalt(10)
  );
  if (validator.RegisterUser(userObj)) {
    const getResponse = await model.RegisterUser(userObj);
    return jwt.sign(_.pick(getResponse, ["userid"]), process.env.TOKEN_SECRET);
  } else {
    let err = new Error();
    err.status = 400;
    err.message =
      "Invalid credentials,Please check the credentials and try again";
    throw err;
  }
};
userService.forgetPass = async (obj) => {
  if (validator.forgetPass(obj.email)) return await model.forgetPass(obj);
  else {
    let err = new Error();
    err.status = 400;
    err.message =
      "Invalid credentials,Please check the credentials and try again";
    throw err;
  }
};
userService.ResetUser = async (obj) => {
  if (validator.ResetUser(obj.password)) {
    obj.password = await bcrypt.hash(obj.password, await bcrypt.genSalt(10));
    return await model.ResetUser(obj);
  } else {
    let err = new Error();
    err.status = 400;
    err.message ="Invalid credentials,Please check the credentials and try again";
    throw err;
  }
};
module.exports = userService;

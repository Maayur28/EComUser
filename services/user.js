// aconst validator = require("../utilities/validate");
const model = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
let userService = {};

userService.LoginUser = async (Obj) => {
  const getLogin = await model.LoginUser(Obj);
  return jwt.sign(_.pick(getLogin, ["userid"]), process.env.TOKEN_SECRET);
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
  const getResponse = await model.RegisterUser(userObj);
  return jwt.sign(_.pick(getResponse, ["userid"]), process.env.TOKEN_SECRET);
};
userService.forgetPass = async (obj) => {
  return await model.forgetPass(obj);
};
userService.ResetUser = async (obj) => {
  obj.password = await bcrypt.hash(obj.password, await bcrypt.genSalt(10));
  return await model.ResetUser(obj);
};
module.exports = userService;

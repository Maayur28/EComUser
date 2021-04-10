const dbModel = require("../utilities/connection");
const bcrypt = require("bcrypt");

let userModel = {};

userModel.LoginUser = async (userObj) => {
  const model = await dbModel.getUserConnection();
  const checkUser = await model.findOne({ username: userObj.username });
  if (checkUser) {
    if (await bcrypt.compare(userObj.password, checkUser.password))
      return checkUser;
    else {
      let err = new Error();
      err.status = 401;
      err.message = "Invalid username or password";
      throw err;
    }
  } else {
    let err = new Error();
    err.status = 404;
    err.message = "You are not registered!";
    throw err;
  }
};
userModel.RegisterUser = async (userObj) => {
  const model = await dbModel.getUserConnection();
  const checkUser = await model.findOne(
    { username: userObj.username },
    { userid: 1, _id: 0 }
  );
  if (checkUser == null) {
    let insertuser = await model.insertMany(userObj);
    if (insertuser.length > 0) return userObj;
    else {
      let err = new Error();
      err.status = 403;
      err.message = "Error in inserting user into database";
      throw err;
    }
  } else {
    let err = new Error();
    err.status = 400;
    err.message = "User has been already registered";
    throw err;
  }
};

userModel.forgetPass = async (obj) => {
  const model = await dbModel.getUserConnection();
  const checkUser = await model.findOne({ username: obj.email });
  if (checkUser) return checkUser;
  else return false;
};
userModel.ResetUser = async (obj) => {
  const model = await dbModel.getUserConnection();
  const checkUser = await model.findOne({ userid: obj.userid });
  if (checkUser)
  {
    let stat=await model.updateOne({userid:obj.userid},{$set:{password:obj.password}})
    if(stat.nModified>0)
    return true;
    else
    {
      let err = new Error();
      err.status = 500;
      err.message = "Sorry!Server is busy.Please try again later";
      throw err;
    }
  }
  else
  {
    let err = new Error();
      err.status = 500;
      err.message = "Sorry!Server is busy.Please try again later";
      throw err;
  };
};

module.exports = userModel;

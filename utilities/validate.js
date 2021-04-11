const joi = require("joi");

let validator = {};

validator.LoginUser = (obj) => {
  if (isNaN(typeof +obj.username / 1) && isNaN(typeof +obj.password / 1)) {
    const schema = joi.object({
      username: joi.string().email().required(),
      password: joi.string().min(8).required(),
    });
    const { error, value } = schema.validate(obj);
    if (error) return false;
    else return true;
  }
  else
  return false;
};
validator.RegisterUser = (obj) => {
  if (
    isNaN(typeof +obj.firstname / 1) &&
    isNaN(typeof +obj.lastname / 1) &&
    isNaN(typeof +obj.username / 1) &&
    isNaN(typeof +obj.password / 1) &&
    isNaN(typeof +obj.userid / 1)
  ) {
    const schema = joi.object({
      firstname: joi.string().required(),
      lastname: joi.string().required(),
      username: joi.string().email().required(),
      password: joi.string().min(8).required(),
      userid: joi.string().length(36).required(),
    });
    const { error, value } = schema.validate(obj);
    if (error) return false;
    else return true;
  } else return false;
};
validator.forgetPass = (email) => {
  const schema = joi.string().email().required();
  const { error, value } = schema.validate(email);
  if (error) return false;
  else return true;
};
validator.ResetUser = (pass) => {
  const schema = joi.string().min(8).required();
  const { error, value } = schema.validate(pass);
  if (error) return false;
  else return true;
};

module.exports = validator;

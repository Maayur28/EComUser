const express = require("express");
const routes = express.Router();
const service = require("../services/user");
const auth=require('../utilities/auth');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

routes.post("/login", async (req, res, next) => {
  try {
    let userLoginToken = await service.LoginUser(req.body);
    res.status(200);
    res.json({ authToken: userLoginToken });
  } catch (error) {
    next(error);
  }
});

routes.post("/register", async (req, res, next) => {
  try {
    let userRegisterToken = await service.RegisterUser(req.body);
    res.status(200);
    res.json({ authToken: userRegisterToken });
  } catch (error) {
    next(error);
  }
});

routes.post("/forgetpassword", async (req, res, next) => {
  let tosend=req.body.email;
  try {
    let check=await service.forgetPass(req.body);
    if (check != false) {
      let token = jwt.sign({ userid: check.userid }, process.env.TOKEN_SECRET, {
        expiresIn: "600s",
      });
      var transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user:process.env.email,
          pass:process.env.password,
        },
      });
      const message = {
        from: "shoeapp28@gmail.com",
        to: tosend,
        subject: "Reset your password",
        html: `<h2>Hi <b>${check.firstname} ${check.lastname}</b>,</h2><p>Please click on the link below to reset your password (valid only for 10 minutes)<br><a href=https://mayur28.herokuapp.com/reset/${token}>CLICK ME</a><p>If this doesn't work please try to copy paste the link in your browser given below </p><br><a href=https://mayur28.herokuapp.com/reset/${token}>https://mayur28.herokuapp.com/reset/${token}</a>`,
      };
      transport.sendMail(message,(error, info) => {
        if (error) {
        res.send("null").status(500);
        } 
        else
        res.send(true).status(200);
      });
    } else res.send(false).status(200);
  } catch (error) {
    next(error);
  }
});
routes.post("/verifytoken",auth, async (req, res, next) => {
  res.status(200);
  res.json({verify:req.user.userid});
});
routes.post("/setresetpass", async (req, res, next) => {
  try {
    let resetStatus = await service.ResetUser(req.body);
    res.status(200);
    res.json({ status:resetStatus });
  } catch (error) {
    next(error);
  }
});

module.exports = routes;

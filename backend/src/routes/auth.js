// this router for authentication
const express=require("express");
const authRouter=express.Router();
const { ValidationSignUp } = require("../utils/Validattion")
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const {userAuth} = require("../utils/userAuth");


authRouter.post("/signup",async (req, res) => {
    try {
      ValidationSignUp(req);
      const { firstName, lastName, emailId, password,age,gender, skills } = req.body;
      const passwordEncrypted = await bcrypt.hash(password, 10);
  
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordEncrypted,
        age,gender, skills
      });
      const savedUser=await user.save();
      const token = await savedUser.getJWT();
       res.cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
          secure: false, 
          maxAge: 24 * 60 * 60 * 1000,
        });
      res.send(savedUser);
    } catch (err) {
      res.status(400).send(err.message);
      console.error(err.message);
    }
  });

authRouter.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
  
    try {
      const user = await User.findOne({ emailId });
      if (!user) {
        return res.status(401).send("Invalid Credential");
      }
  
      const isPasswordValid = await user.validatePassword(password);
      if (isPasswordValid) {
        const token = await user.getJWT();
  
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
          secure: false, 
          maxAge: 24 * 60 * 60 * 1000,
        });
  
        res.send(user); 
      } else {
       return res.status(401).send("Invalid Credential");
      }
    } catch (err) {
      res.status(400).send("Something went wrong in the login ,try again");
      console.error(err.message);
    }
  });

  authRouter.post("/logout", async (req, res) => {
    res.clearCookie("token");
    res.send("You logged out successfully");
  });
  

  module.exports=authRouter;
  

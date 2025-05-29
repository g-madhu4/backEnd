// this is for profile routing
const express=require("express");
const profileRouter=express.Router();
const { userAuth } = require("../utils/userAuth");
const{validateEditProfileData} =require("../utils/Validattion");

profileRouter.get("/profile", userAuth, (req, res) => {
    const user = req.user;
    console.log(user);
    res.send(user);
  });

  profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{

     try{

      if(!validateEditProfileData(req)){
    
        return res.send("you cannot edit this feild");
      }

      const loggedUer=req.user;
      Object.keys(req.body).forEach((key)=>(loggedUer[key]=req.body[key]));
      await loggedUer.save();
      console.log(loggedUer);
      return res.send(loggedUer);
     }
     catch(err){

      res.status(400).send(err.message);
     }


  })

  module.exports=profileRouter;
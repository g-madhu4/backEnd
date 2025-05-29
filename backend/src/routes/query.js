 const express = require("express");
 const QueryRouter=express.Router();
 const {User} =require("../models/user");

 const {userAuth}=require("../utils/userAuth");

const {queryRequest}=require("../models/queryRequest");
const { connectionRequest } = require("../models/connectionRequest");

QueryRouter.post("/user/query/:toUserId",userAuth,async(req,res)=>{
    try{
    const loggeUser = req.user._id;
    const toUserId = req.params.toUserId;
    const {query}=req.body;
    if(loggeUser==toUserId){
        return res.send("you can't make this query");
    }
      const toUser = await User.findById(toUserId);
      if(!toUser){
        return res.send("you can't make this query");
      }
      const check=await connectionRequest.find({
        $or:[
         {fromUserId:loggeUser,
          toUserId:toUserId,
          status:"accepted"},{
          fromUserId:toUserId,
          toUserId:loggeUser,
          status:"accepted"}] 
      });
      if(!check){
        return res.send(`make connection with ${req.user.firstName}`)
      }
      const Query =new queryRequest({
        fromUserId:loggeUser,
        toUserId:toUserId,
        query:query,
        fromPhotoUrl:req.user.photoURl,
        toPhotoUrl:toUser.photoURl
      });
      await Query.save();
      res.send(Query);
    }
    catch(err){
        res.status(400).send("this query not allowed");
    }
})

QueryRouter.get("/user/query/from/:toUser",userAuth,async (req,res)=>{

    try{
    const loggeUserId=req.user._id.toString();
    const toUserid=req.params.toUser.toString();

    if(loggeUserId === toUserid){
        return res.status(400).send("you cannt make this call");
    }
     const toUser = await User.findById(toUserid);
      if(!toUser){
        return res.send("you can't make this query");
      }

    const data= await queryRequest.find({
         fromUserId:loggeUserId,
         toUserId:toUserid,
    });
    if(data.length===0){
        return res.send([]);
    }
    res.send(data);
}
catch(err){
    console.log("error massage"+err.message);
}

})
QueryRouter.get("/user/query/to/:toUser",userAuth,async (req,res)=>{

    try{
    const loggeUserId=req.user._id.toString();
    const toUserid=req.params.toUser.toString();

    if(loggeUserId === toUserid){
        return res.status(400).send("you cannt make this call");
    }

    const data= await queryRequest.find({
         fromUserId:toUserid,
        toUserId:loggeUserId
    });
    if(data.length===0){
        return res.send([]);
    }
    res.send(data);
}
catch(err){
    console.log("error massage"+err.message);
}

})
module.exports={QueryRouter};
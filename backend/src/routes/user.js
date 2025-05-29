const express=require("express");

const userRouter=express.Router();
const{userAuth}=require("../utils/userAuth");
const {connectionRequest}=require("../models/connectionRequest");
const { connections } = require("mongoose");
const { User } = require("../models/user");

userRouter.get("/user/requests", userAuth, async (req, res) => {
    try {
      const loggedUser = req.user;
  
      const allRequests = await connectionRequest.find({
        toUserId: loggedUser._id,
        status: "intrested" // fix spelling if needed
      }).populate("fromUserId", "firstName lastName  photoURl about gender skills");
  
      if (allRequests.length === 0) {
        return res.status(200).json({
          message: "There are no requests.",
          requests: []
        });
      }
  
     return res.send(allRequests);
  
    } catch (err) {
      return res.status(500).json({
        message: "Server error",
        error: err.message
      });
    }
  });

 userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const userConnections = await connectionRequest.find({
      $or: [
        {
          toUserId: loggedUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", "firstName lastName photoURl about gender skills")
      .populate("toUserId", "firstName lastName photoURl about gender skills");

    const otherUsers = userConnections.map((conn) => {
      const fromId = conn.fromUserId._id?.toString?.() || conn.fromUserId.toString();
      const toId = conn.toUserId._id?.toString?.() || conn.toUserId.toString();

      // Identify the other user in the connection
      if (fromId === loggedUser._id.toString()) {
        return conn.toUserId;
      } else {
        return conn.fromUserId;
      }
    });

    return res.json({
      message: `${loggedUser.firstName}, here are your connections`,
      connections: otherUsers,
    });
  } catch (err) {
    console.error("Error fetching user connections:", err);
    return res.status(400).json({
      message: "Bad request",
    });
  }
});


  userRouter.get("/user/feed",userAuth, async(req,res)=>{
    try{

    const loggedInUser=req.user;
    let page=parseInt(req.query.page)||1;
    let limit=parseInt(req.query.limit)||10;

    limit=limit>50?50:limit;

    const skip=(page-1)*10;
    const  connectionRequests= await connectionRequest.find({
        $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
    }).select("fromUserId toUserId");

    const hideUserFromFeed= new Set();
    connectionRequests.forEach((req)=>{
        hideUserFromFeed.add(req.fromUserId.toString());
        hideUserFromFeed.add(req.toUserId.toString());
    })

    const users= await User.find({
       $and:[{_id:{ $nin:Array.from(hideUserFromFeed)}},
        {_id:{$ne:loggedInUser._id}}]
    })

    return res.json({
        message: `${loggedInUser.firstName} your feed`,
        data: users.map(user => ({
          firstName: user.firstName,
          lastName: user.lastName,
          photoURl:user. photoURl,
           skills:user. skills,
           _id:user._id.toString()
        }))
    })
  }

    catch(err){
    res.status(400).json({
        message:"bad request",
    })
    }

})



  



module.exports=userRouter;
const express=require("express");

const requestRouter=express.Router();
const {userAuth}=require("../utils/userAuth");
const {connectionRequest}=require("../models/connectionRequest");
const { User } = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
  
      const allowedStatus = ["ignored", "intrested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid request status." });
      }
  
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const existingRequest = await connectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
        ]
      });
  
      if (existingRequest) {
        return res.status(409).json({ message: "Connection request already exists." });
      }
  
      const newRequest = new connectionRequest({ fromUserId, toUserId, status });
      await newRequest.save();
  
      res.status(201).json({ message: "Connection request sent successfully." });
  
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });

  requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;
  
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid request status.",
        });
      }
  
      const requestSend = await connectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: "intrested" // Optional: update to "interested" in DB if it's a typo
      });
  
      if (!requestSend) {
        return res.status(404).json({
          message: "Request not found.",
        });
      }
  
      requestSend.status = status;
      const updatedRequest = await requestSend.save();
  
      res.json({
        message: `Request successfully ${status}.`,
        request: updatedRequest
      });
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
module.exports={requestRouter};
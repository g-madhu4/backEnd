 const mongoose =require("mongoose");

 const connectionRequestSchema=new mongoose.Schema({     
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        require:true,
        enum:{
            values:["ignored","intrested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
 },
 {
    timestamps:true,
 });

 connectionRequestSchema.index({fromUserId:1,toUserId:1})

 connectionRequestSchema.pre("save",function(next){
     const connectionRequest=this;
     if(connectionRequest.fromUserId.equals(this.toUserId)){
        throw new Error("cannot send the connection request to your self");
     }
     next();
 })

 const connectionRequest=new mongoose.model("connectionRequest",connectionRequestSchema);

 module.exports={connectionRequest};
const mongoose =require("mongoose");


const querySchema= new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId
    },
    query:{
        type:String,
    },
    fromPhotoUrl:{
        type:String,
    },
    toPhotoUrl:{
        type:String
    }
},{timestamps:true})

const queryRequest =new mongoose.model("queryRequest",querySchema);
module.exports= {queryRequest};

const jwt=require("jsonwebtoken");
const {User}=require("../models/user")


const userAuth = async (req,res,next)=>{ 
  try{
    const {token}=req.cookies;
    
    const decodedObj=await jwt.verify(token,"hard work is matters");
    const {_id}=decodedObj;
    const user= await User.findById(_id);
    if(!user){
        throw new Error("User not found");
    }
    req.user=user;
    next();
  }
  catch(e) {
    res.status(400).send("Error: " + e.message);
  }

};
module.exports= {userAuth};
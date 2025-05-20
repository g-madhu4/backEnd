const express = require("express");
const { connectDb } = require("./config/database");
const { adminAuth, userAuth } = require("../middleware/adminAuth");
const { User } = require("./models/user");
const {ValidationSignUp}=require("./utils/Validattion");
const bcrypt = require("bcryptjs");
const cookie=require('cookies');
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");



const app = express();


app.use(express.json());
app.use(cookieParser());

app.post("/userInfo", async (req, res) => {
    try { 
    ValidationSignUp(req);
    const{firstName,lastName,emailId,password}=req.body;
    const passwordEncrypted= await bcrypt.hash(password,10);
    console.log(passwordEncrypted);
     const user = new User({
        firstName,
        lastName,
        emailId,
        password:passwordEncrypted
     });
        await user.save();
        res.send(" User is added successfully !");
    } catch (err) {
        res.status(400).send(err.message);
        console.error(err.message);
    }
});

app.post("/login",async(req,res)=>{
   
    const{emailId,password}=req.body;

    try{
        const user= await User.findOne({emailId:emailId});
        if(!user){
            throw new Errow("Invalid Crendential1");
        }

        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(isPasswordValid){

           const token=await jwt.sign({_id:user._id},"hard work is matters",{expiresIn:"5s"});

            res.cookie("token",token);
            res.send("loging sucsessfully")
        }
        else{
            res.send("Invalid Credential2");
        }
    }catch(err){
        res.status(400).send("something went wrong in the login");

    }

})

app.get("/profile",userAuth, async(req,res)=>{
   
    const user=req.user;

    console.log(user);
    res.send("cookies checking");
})




app.get("/user", async (req, res) => {
    const userName = '6807460b96fd06abd22f50f1';
    try {
        const user = await User.findByIdAndDelete(userName);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user);
    } catch (err) {
        res.status(400).send(err.message);
        console.error(err.message);
    }
});

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("something went wrong");
        console.error(err.message);
    }
});

app.patch("/updateInfo",async(req,res)=>{
    const user=new User(req.body);
    try{
        const updateList=["firstName","lastName"," mobileNumber"," photoURl","about"];

    const isUpdate=Object.keys(req.body).every((k)=> updateList.includes(k));
    
    if(!isUpdate){
        throw new Error("Updtate is not valid");

    }
        await User.findByIdAndUpdate('680e6d7c2b254777415b8515',req.body,{
            runValidators:true
        });
        
         res.send("user info update succufully");
    }
    catch(err){
        res.status(400).send("user info was not update");
    }
})


connectDb().then(() => {
    console.log("Cluster connected successfully");
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}).catch((err) => {
    console.error("Database connection error:", err.message);
}); 

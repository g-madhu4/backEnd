const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50

    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowerCase:true,
        trim:true


    },
    password:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:Number

    },
    age:{
        type:Number
    },
    photoURl:{
        type:String,
        default:"https://tse4.mm.bing.net/th?id=OIP.g7pCyO-Wp8LxA5oJII-b_QHaHa&pid=Api&P=0&h=180"
    },
    about:{
        type:String,
        default:"This is the default user info"
    },
    gender:{
       type:String,
       enum :{
        values:["male","female","other"],
        message:`{VALUE} wrong feild`
       }
    //    validate(value){
    //     if(!["male","female","other"].includes(value)){
    //         throw new Error("Gender data is not validate");
    //     }
    //    }
      
    },
    skills:{
        type:[String]
       } 
   
});

userSchema.methods.validatePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  };
  
  userSchema.methods.getJWT = function () {
    return jwt.sign({ _id: this._id }, "hard work is matters", {
      expiresIn: "1d",
    });
  };
  userSchema.index({firstName:1,lastName:1});
  

const myNameSchema=new mongoose.Schema({
    name:{
        type:[String]
    }
})
 
const Name=mongoose.model("Name",myNameSchema);

const User=mongoose.model("User",userSchema);

module.exports={User,Name};
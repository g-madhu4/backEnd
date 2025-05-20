const mongoose=require("mongoose");

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
       validate(value){
        if(!["male","female","other"].includes(value)){
            throw new Error("Gender data is not validate");
        }
       } 
    }
   
});

const myNameSchema=new mongoose.Schema({
    name:{
        type:String
    }
})

const Name=mongoose.model("Name",myNameSchema);

const User=mongoose.model("User",userSchema);

module.exports={User,Name};
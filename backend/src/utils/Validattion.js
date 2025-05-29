const validator=require("validator");

const ValidationSignUp =(req)=>{

    const{firstName,lastName,emailId,password}=req.body;

    if(!firstName || !lastName){
        throw new Error("you must enter your name");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("enter the correct emailId");
    }
    else if(!validator.isStrongPassword(password)) {
      throw new Error("Please make sure your password to strong");
    }

}
const validateEditProfileData =(req)=>{

    const allowedData=["firstName","lastName","password","age","photoURl","mobileNumber","skills","about","gender"];
    
  const isAllowed=Object.keys(req.body).every(feild=>allowedData.includes(feild));

  return isAllowed;


}
module.exports={ValidationSignUp,validateEditProfileData};
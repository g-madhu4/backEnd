const mongoose=require("mongoose");

const connectDb=async()=>{
    await mongoose.connect("mongodb+srv://madhu21:70k3dA8HrO2f8vpl@cluster0.3ynkjv9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
};

module.exports={connectDb}
const express=require("express");
const app=express();

app.use("/test",(req,res)=>{
    res.send("This is happning now");
})


app.use("/about",(req,res)=>{
    res.send("This is in the route ");
})

app.listen(3000,()=>{
    console.log("hii madhu , dont bother about what is is happning now , happy about your future.");
});

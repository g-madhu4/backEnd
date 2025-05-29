const express = require("express");
const { connectDb } = require("./config/database");
const { User } = require("./models/user");
const cookieParser = require("cookie-parser");

const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
  origin:" http://localhost:5173",
  credentials:true
}))

const authRouter= require("./routes/auth");
const profileRouter=require("./routes/profile");
const {requestRouter}=require("./routes/request");
const userRouter=require("./routes/user");
const {QueryRouter}=require("./routes/query");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",QueryRouter);

connectDb()
  .then(() => {
    console.log("Cluster connected successfully");
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

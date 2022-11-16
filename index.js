const express= require("express");
const app=express();
const mongoose=require("mongoose");
const helmet=require("helmet");
const dotenv=require("dotenv")
const morgan=require("morgan")
const multer= require("multer")
const userRoute=require('./routes/users')
const authRoute=require('./routes/auth')
const postRoute=require('./routes/posts');
const { diskStorage } = require("multer");
const path= require("path");

dotenv.config();
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true},()=>{
    console.log("mongodb  connected")
});
app.use("/images",express.static(path.join(__dirname, "public/images")));

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/posts",postRoute)
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/images")
    },
    filename:(req,file,cb)=>{
        cb(null,req.body.name)
    }
})
const upload=multer({storage})

app.post("/api/upload",upload.single("file"),(req,res)=>{
    try{
        res.status(200).json("the file uploaded successfully")
    }catch{
        console.log(err)
    }
})
app.listen(8800,()=>{
    console.log("Backend server is running")
})
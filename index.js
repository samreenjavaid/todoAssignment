const express=require('express');
const mongoose=require('mongoose');
const TodoRoutes=require("./Routes/TodoRoutes");

const app=express();
app.use(express.json());

//connecting db
mongoose.connect("mongodb://localhost:27017/").then(()=>{
    
}).catch((err)=>{
    console.log("Error",err);
});

//routes
app.use("/Todo",TodoRoutes);

//port creating
app.listen(300,()=>{
    console.log("server connected on 300");
})
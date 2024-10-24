const express=require("express");

const app=express();

require("dotenv").config();

require("./conn/conn");

const User = require("./routes/User");
const Book = require("./routes/Book");
const Favourite=require("./routes/Favourite")
const Cart=require("./routes/Cart")
app.use(express.json());

app.use("/api/v1",User);
app.use("/api/v1/books",Book);
app.use("/api/v1",Favourite);
app.use("/api/v1",Cart);
// app.use("/api/v1",Order);


app.get("/home",(req,res)=>{

    res.send("<h2>Hello World</h2>");

});


app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
}) ;
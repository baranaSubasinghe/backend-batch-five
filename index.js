import express from 'express';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import orderRouter from './routes/orderRouter.js';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import jwt from 'jsonwebtoken';

const app= express();

app.use(bodyparser.json())

app.use((req,res,next)=>{

    const tokenString = req.header("Authorization")
    if(tokenString!=null){
        const token = tokenString.replace("Bearer ","")
        //console.log(token);

        jwt.verify(token,"secretKey",(err,decoded)=>{
            if(decoded!=null){
                console.log(decoded)
                req.user=decoded
                next();
            }else{
                console.log("token is invalid")
                res.status(401).json({
                    message:"token is invalid"
                })
            }
        })
        
    }else{
        next();
        
    }
  // console.log(tokenString);
   
   // next();//meya awlk nthhuw issrht ywnwa

     
})
mongoose.connect("mongodb+srv://admin:123@cluster0.ttdf15u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("db is connected");
})
.catch((err)=>{
    console.log(err);
})


app.use("/products",productRouter)
app.use("/users",userRouter)
app.use("/orders",orderRouter)




app.listen(3001,()=>{
    console.log('server is runnig on port 3001');
}) 

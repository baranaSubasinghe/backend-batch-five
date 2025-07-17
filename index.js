import express from 'express';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';

import orderRouter from './routes/orderRouter.js';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import reviewRouter from './routes/reviewRouter.js';
import cors from 'cors';


import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const app= express();

app.use(cors())

app.use(bodyparser.json())


app.use((req,res,next)=>{

    const tokenString = req.header("Authorization")
    if(tokenString!=null){
        const token = tokenString.replace("Bearer ","")
        //console.log(token);

        jwt.verify(token,process.env.JWT_KEY ,
            (err,decoded)=>{
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
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("db is connected");
})
.catch((err)=>{
    console.log(err);
})


app.use("/api/products",productRouter)
app.use("/api/users",userRouter)
app.use("/api/orders",orderRouter)
app.use("/api/reviews",reviewRouter

)




app.listen(3001,()=>{
    console.log('server is runnig on port 3001');
}) 

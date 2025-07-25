import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true,
        default : "pending"
    },
    labledTotal :{
        type:String,
        required : true
    },

    total :{
        type : Number,
        required : true
    },
    products :  [
        {
            productInfo:{
                productId : {
                    type : String,
                    required : true
                },
                name : {
                    type : String,
                    required : true
                },
                altNameas : [
                    {
                        type : String
                    }
                ],
                description : {
                    type : String,
                    required : true
                },
                images : [
                    {
                        type : String
                    }
                ],
                price : {
                    type : Number,
                    required : true
                },
                labledPrice : {
                    type : Number,
                    required : true
                },
               
            },
            quantity : {
                type : Number,
                required : true
            }
        }
    ],
    date : {
        type : Date,
        default : Date.now
    }
})

const Order = mongoose.model("Order",orderSchema);
export default Order
    

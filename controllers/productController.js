import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function getProduct(req,res){
   /* Product.find().then(
        (data)=>{
            res.json(data)
            
        }
    )*/
   try {
    if(isAdmin(req)){
        const products = await Product.find()
        res.json(products)
    }else{
        const products = await Product.find({isAvailable : true})
        res.json(products)
    }
    
   } catch (error) {
    res.status(500).json({
        message:"something went wrong",
        error:error
    })
   }

}
export function saveProduct(req,res){

    if(!isAdmin(req)){
        res.status(403).json({
            message:"You are not allowed to perform this action"
        })
        return
        
    }

    const product = new Product(
       req.body
    ) 
    product.save()
    .then(() => {
        res.json({
            message:"data saved"
            
        })
        
    })
    .catch(() => {
        res,json({
            message:"data not saved"
        })
    })
}

export async function deleteProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message:"you are not authorized to delete a product"
        })
        return 
    }
     
    try{
    await Product.deleteOne({
    productId : req.params.productId})
    res.json({
        message:"product deleted"
    })
    }catch(error){
        res.status(500).json({
            message:"something went wrong",
            error:error
        })
    }
}

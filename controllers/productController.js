import Product from "../models/product.js";
import { isAdmin } from "./userController.js";


//get all products
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

//save a product
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

//delete a product
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

//update a product
export async function updateProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message:"you are not authorized to update a product"
        })
        return 
    }

    const productId = req.params.productId
    const updatingProduct = req.body

    try{
        await Product.updateOne({productId : productId},updatingProduct)
            
        res.json({
            message:"product updated successfully"
        })

    }catch(error){
        res.status(500).json({
            message:"something went wrong",
            error:error
        })
    }

}

//get product by Id
export async function getProductById(req,res){
    const productId = req.params.productId;

    try{
        const product = await Product.findOne({productId : productId})
        if(product==null){
            res.status(404).json({
                message:"product not found with this id"
            })
            return
        }
        if(Product.isAvailable){
            res.json(product)
        }else{
            if(!isAdmin(req)){
                res.status(403).json({
                    message:"product not found"
                })
                return 
            }else{
                res.json(product)
            }
            
            
        }

    }catch(error){
        res.status(500).json({
            message:"something went wrong",
            error:error
        })
    }
}

    
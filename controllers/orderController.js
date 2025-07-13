import Order from '../models/order.js'; // 🔁 adjust path if needed
import Product from '../models/product.js';
export async function createOrder(req,res){
    //get user informations
    if (req.user==null){
        res.status(403).json({
            message : "please login and try again"
        })
        return 

    }

    //add cureent users name if not provided
    const orderInfo =req.body

    if(orderInfo.name==null){
        orderInfo.name = req.user.firstName+" "+req.user.lastName
    }
    

    //orderId generation
    let orderId = "CBC00001"

    const lastOrder = await Order.find().sort({date :-1}).limit(1)

    if(lastOrder.length>0){
        const lastOrderId=lastOrder[0].orderId
        const lastOrderIdNumberString = lastOrderId.replace("CBC","")//00054
        const lastOrderIdNumber = parseInt(lastOrderIdNumberString)//54
        const newOrderNumber = lastOrderIdNumber+1//55
        const newOrderIdNumberString = String (newOrderNumber).padStart(5,"0")//00055
        orderId = "CBC"+newOrderIdNumberString
    }

    try{
        let total = 0 ;
        let labledTotal =0;
        const products=[]

        for(let i=0;i<orderInfo.products.length;i++){
            const item =  await Product.findOne({productId : orderInfo.products[i].productId})
            if(item==null){
                res.status(404).json({
                    message : "Product with id "+orderInfo.products[i].productId+" not found"
                })
                return
            }

            if(item.isAvailable==false){
                res.status(404).json({
                    message : "Product with id "+orderInfo.products[i].productId+" is not available right now"
                })
                return
                
            }
            products[i] = {
                productInfo : {
                    productId : item.productId,
                    name : item.name,
                    altNameas : item.altNameas,
                    description : item.description,
                    images : item.images,
                    price : item.labledPrice,
                    labledPrice : item.labledPrice

                },
                quantity : orderInfo.products[i].quantity
            }
            //total= total + item.labledPrice*orderInfo.products[i].quantity
            total+=item.price*orderInfo.products[i].quantity
            //labledTotal = labledTotal + item.labledPrice*orderInfo.products[i].quantity
            labledTotal+=item.labledPrice*orderInfo.products[i].quantity

        }

    const order = new Order({
        orderId : orderId,
        email : req.user.email,
        phone : orderInfo.phone,
        name : orderInfo.name,
        address : orderInfo.address,
        total : 0,
        products : [],
        labledTotal : labledTotal, 
        total : total,
    })
   
     const createdOrder=await order.save()
     res.json({
        message : "order created",
        order : createdOrder
     })
    }catch(error){
        res.status(500).json({
            message:"failed to create order",
            error:error
        })
    }
 
    //create order object 

     

}
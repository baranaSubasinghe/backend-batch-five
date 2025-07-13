import express from 'express';
import { getProduct, getProductById,saveProduct, deleteProduct, updateProduct} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get("/",getProduct)
productRouter.post("/",saveProduct)
productRouter.delete("/:productId",deleteProduct)
productRouter.put("/:productId",updateProduct)
productRouter.get("/:productId",getProductById)


export default productRouter
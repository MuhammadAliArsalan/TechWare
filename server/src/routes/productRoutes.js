import express from "express"
import { addProduct, deleteProduct, getOneProduct, updateProduct, getAllProducts, getProducts, getAllSellings, getAllRentalProducts, getRentalProduct, listSecondhandProduct, listRentalSecondhandProduct } from "../controllers/product.controller.js"
import { isLoggedIn } from "../middlewares/authentication.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";

const productRoutes=express.Router();
productRoutes.post("/addProduct",
    upload.fields([
    {
        name:"product_image",
        maxCount:2
    }
]),
isLoggedIn,
addProduct);
productRoutes.get("/getAllProducts", isLoggedIn,getAllProducts);
productRoutes.get("/getAllSellings",getAllSellings);
productRoutes.get("/getAllRentalProducts", getAllRentalProducts);
productRoutes.get("/listSecondHand", listSecondhandProduct);
productRoutes.get("/listRentalSecondHand", listRentalSecondhandProduct);


productRoutes.get("/getProducts", isLoggedIn,getProducts);
// productRoutes.get("/getProduct/:id",isLoggedIn,getOneProduct)

productRoutes.get("/getProduct/:id",getOneProduct)
productRoutes.get("/getRentalProduct/:id",getRentalProduct);


productRoutes.patch("/updateProduct/:id",upload.fields([
    {
        name:"product_image",
        maxCount:2
    }
]),isLoggedIn,updateProduct)

productRoutes.delete("/deleteProduct/:id",isLoggedIn,deleteProduct)

export default productRoutes;
import express from "express"
import { isLoggedIn } from "../middlewares/authentication.middleware.js"
import { validateProduct } from "../controllers/prod_authentication.controller.js"

const validationRoutes=express.Router();

// validationRoutes.post("/validate-product/:product_id", (req, res, next) => {
//     console.log("🏁 Validate Product Route hit! Id:", req.params.product_id); // Debug log
//     next();
//   },isLoggedIn, validateProduct);

validationRoutes.post(
  "/validate-product/:product_id",
  (req, res, next) => {
    console.log("Auth headers:", req.headers.authorization); // Debug
    next();
  },
  isLoggedIn, 
  validateProduct
);

export default validationRoutes
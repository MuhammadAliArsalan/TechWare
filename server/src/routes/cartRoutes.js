import express from "express";
import { addToCart, deleteCartItem, updateCartItem, getCartItems,getUserCartItems, clearUserCart } from "../controllers/cartController.js";
import { isLoggedIn } from "../middlewares/authentication.middleware.js";


const router = express.Router();

router.post("/add", isLoggedIn,addToCart);
router.delete("/delete/:cart_id",isLoggedIn, deleteCartItem);
router.put("/update/:cart_id",isLoggedIn, updateCartItem);
router.get("/getItems",isLoggedIn, getCartItems);
router.get('/getUserCartItems', isLoggedIn, getUserCartItems);
router.delete('/clear', isLoggedIn, clearUserCart);

export default router;

// import express from "express";
// import { 
//   addToCart, 
//   deleteCartItem, 
//   updateCartItem,
//   getCartItems,
//   mergeGuestCart
// } from "../controllers/cartController.js";
// import { isLoggedIn } from "../middlewares/authentication.middleware.js";

// const router = express.Router();

// // Public routes (don't require authentication)
// router.post("/add", addToCart);
// router.get("/getItems", getCartItems);

// // Protected routes (require authentication)
// router.delete("/delete/:cart_id", deleteCartItem);
// router.put("/update/:cart_id", updateCartItem);
// router.post("/merge", mergeGuestCart);

// export default router;

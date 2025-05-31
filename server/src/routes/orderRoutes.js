import express from "express"
import { placeOrder,getOrderDetails,getOrderStatus, getUserOrders, cancelOrder } from "../controllers/orderController.js"
import { isLoggedIn } from "../middlewares/authentication.middleware.js"

const router=express.Router();

router.post("/placeOrder",isLoggedIn,placeOrder);
router.get("/details/:order_id", isLoggedIn, getOrderDetails);
router.get("/status/:order_id", isLoggedIn, getOrderStatus);
router.get("/user", isLoggedIn, getUserOrders);
router.patch("/:order_id/cancel", isLoggedIn, cancelOrder);

export default router;
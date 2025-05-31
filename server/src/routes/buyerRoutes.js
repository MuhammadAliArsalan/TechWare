import express from 'express';
import { getUserOrders,cancelOrder } from '../controllers/buyerDashboard.js';

import { isLoggedIn } from '../middlewares/authentication.middleware.js';

const router = express.Router();

router.post("/cancel/:order_id", isLoggedIn, cancelOrder);
router.get("/getUserOrders", isLoggedIn, getUserOrders);


export default router;
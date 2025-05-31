import express from "express";
import {getTotalProductsSold,productBreakdown,monthlyAnalytics,updateOrderStatus,getAllOrders,getProductRentalHistory,getUserSecondhandProducts} from "../controllers/sellerAnalyticsController.js";
import { isLoggedIn ,isAdmin, authorizeSeller} from "../middlewares/authentication.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { dashboardSeller, revenueReport ,topProducts, ratingSummary, orderBreakdown, orderPagination, orderDetails, updateStatus, ordersByQuery} from "../controllers/seller.js";

const router=express.Router();

// router.get('/totalSold',isLoggedIn,getTotalProductsSold);
// router.get('/productBreakdown',isLoggedIn,productBreakdown);
// router.get('/monthlyAnalytics',isLoggedIn,monthlyAnalytics);
// router.put('/updateStatus/:order_id',isLoggedIn,updateOrderStatus);
// router.get('/getAllOrders',isLoggedIn,getAllOrders);
// router.get("/getRentalHistory/:id",isLoggedIn,getProductRentalHistory);
// router.get("/userSecondHand/:id",isAdmin, getUserSecondhandProducts); //for admin 

router.get('/dashboard-overview',isLoggedIn,dashboardSeller);
router.get('/revenue-report',isLoggedIn,revenueReport);
router.get('/top-products', isLoggedIn, authorizeSeller,topProducts);
router.get('/rating-summary', isLoggedIn, authorizeSeller,ratingSummary); 
router.get('/order-status', isLoggedIn, authorizeSeller,orderBreakdown);
router.get('/all-orders', isLoggedIn,authorizeSeller,orderPagination);
router.get('/order/:orderId', isLoggedIn,authorizeSeller,orderDetails);
router.post('/orders-by-query', isLoggedIn, authorizeSeller, ordersByQuery);
router.patch('/order/:orderId/status', isLoggedIn,authorizeSeller,updateStatus);





export default router;
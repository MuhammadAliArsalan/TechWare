import express from 'express';
import { 
    totalUsers, 
    totalOrders, 
    totalRevenue, 
    totalTransactions, 
    topSellingProduct, 
    topSellers,
    revenueBySeller
} from '../controllers/adminAnalyticsController.js';
import { isAdmin } from '../middlewares/authentication.middleware.js';

const router = express.Router();

// Admin Dashboard Routes
router.get('/total-users',isAdmin, totalUsers);
router.get('/total-orders',isAdmin, totalOrders);
router.get('/total-revenue',isAdmin, totalRevenue);
router.get('/total-transactions',isAdmin, totalTransactions);
router.get('/top-selling-products',isAdmin, topSellingProduct);
router.get('/top-sellers',isAdmin, topSellers);
router.get('/revenue-sellers',isAdmin, revenueBySeller);

export default router;

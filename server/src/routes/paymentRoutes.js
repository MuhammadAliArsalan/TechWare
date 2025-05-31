import express from 'express'
import { getAccessToken,verifyTransaction,savePayment } from '../controllers/paymentController.js'
import { isLoggedIn } from '../middlewares/authentication.middleware.js';

const router = express.Router();

router.post('/get-token',isLoggedIn, getAccessToken);
router.get('/verifyTxn', verifyTransaction);
router.post('/savePayment',isLoggedIn,savePayment);

export default router;
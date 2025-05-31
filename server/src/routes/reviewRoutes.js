import express from 'express';
import { addReview,getAllReviews,getReviewsByProduct,getReviewsBySeller } from '../controllers/reviewsRatingController.js';
import { isLoggedIn } from '../middlewares/authentication.middleware.js';

const router= express.Router();

router.post('/add', isLoggedIn, addReview);
router.get('/all', getAllReviews);
router.get('/product/:product_id', getReviewsByProduct);
router.get('/seller/:user_id', getReviewsBySeller);

export default router;
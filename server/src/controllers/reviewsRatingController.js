import pool from "../../dbConnect.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const addReview = asyncHandler(async (req, res) => {
    const { product_id, rating, review_text, order_id } = req.body;
    const user_id = req.user?.user_id;

    if (!product_id || !rating || !order_id) {
        throw new ApiError(400, 'Product ID, rating, and order ID are required');
    }

    //  Check if the order exists, belongs to the user, is delivered and contains the product
    const orderCheckQuery = `
        SELECT o.status, oi.product_id
        FROM orders o
        JOIN order_item oi ON o.order_id = oi.order_id
        WHERE o.order_id = $1 AND o.user_id = $2 AND oi.product_id = $3
    `;
    const orderCheckResult = await pool.query(orderCheckQuery, [order_id, user_id, product_id]);

    if (orderCheckResult.rows.length === 0) {
        throw new ApiError(403, "You can't review a product you haven't purchased.");
    }

    const orderStatus = orderCheckResult.rows[0].status;
    if (orderStatus.toLowerCase() !== 'delivered') {
        throw new ApiError(403, 'You can only review a product after the order has been delivered.');
    }

    //  Prevent duplicate reviews for the same product in same order
    const duplicateCheckQuery = `
        SELECT * FROM reviewrating
        WHERE user_id = $1 AND product_id = $2 AND order_id = $3
    `;
    const duplicateCheck = await pool.query(duplicateCheckQuery, [user_id, product_id, order_id]);

    if (duplicateCheck.rows.length > 0) {
        throw new ApiError(400, 'You have already reviewed this product for this order.');
    }

    // Insert review
    const insertQuery = `
        INSERT INTO reviewrating (product_id, user_id, rating, review_text, order_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const values = [product_id, user_id, rating, review_text || null, order_id];
    const result = await pool.query(insertQuery, values);

    return res.status(201).json(new ApiResponse(201, result.rows[0], 'Review added successfully.'));
});

// 2. Get All Reviews
export const getAllReviews = asyncHandler(async (req, res) => {
    const query = `SELECT * FROM reviewrating ORDER BY review_id DESC`;
    const result = await pool.query(query);

    return res.status(200).json(new ApiResponse(200, result.rows, 'All reviews fetched successfully.'));
});

// 3. Get Reviews by Product ID
export const getReviewsByProduct = asyncHandler(async (req, res) => {
    const { product_id } = req.params;

    if (!product_id) {
        throw new ApiError(400, 'Product ID is required.');
    }

    const query = `SELECT * FROM reviewrating WHERE product_id = $1 ORDER BY review_id DESC`;
    const result = await pool.query(query, [product_id]);

    return res.status(200).json(new ApiResponse(200, result.rows, 'Product reviews fetched successfully.'));
});

// 4. Get Reviews by Seller ID
export const getReviewsBySeller = asyncHandler(async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        throw new ApiError(400, 'Seller ID is required.');
    }

    const query = `
        SELECT r.*
        FROM reviewrating r
        JOIN product p ON r.product_id = p.product_id
        WHERE p.user_id = $1
        ORDER BY r.review_id DESC
    `;
    const result = await pool.query(query, [user_id]);

    return res.status(200).json(new ApiResponse(200, result.rows, 'Seller reviews fetched successfully.'));
});

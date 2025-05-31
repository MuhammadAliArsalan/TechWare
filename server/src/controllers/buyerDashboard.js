import pool from "../../dbConnect.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


//Get particular User Orders
export const getUserOrders = asyncHandler(async (req, res) => {
    const user=req.user;
    if(!user){
      throw new ApiError(401, "Unauthorized: User not found in request. Ensure you are logged in.");
    }

    const user_id=user.user_id;
    if (!user_id) {
        throw new ApiError(400, "User ID is required.");
    }

    const query = `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`;
    const result = await pool.query(query, [user_id]);

    if (!result.rows.length) {
        throw new ApiError(404, "No orders found for this user.");
    }

    res.status(200).json({ success: true, orders: result.rows });
});

// Cancel Order (Only before shipping)
export const cancelOrder = asyncHandler(async (req, res) => {
    const { order_id } = req.params;

    if (!order_id) {
        throw new ApiError(400, "Order ID is required.");
    }

    // Check current order status
    const checkQuery = `SELECT status FROM orders WHERE order_id = $1`;
    const checkResult = await pool.query(checkQuery, [order_id]);

    if (!checkResult.rows.length) {
        throw new ApiError(404, "Order not found.");
    }

    const orderStatus = checkResult.rows[0].status;
    if (orderStatus !== "processing") {
        throw new ApiError(400, "Order cannot be canceled after processing.");
    }

    // Cancel the order
    const cancelQuery = `UPDATE orders SET status = 'cancelled' WHERE order_id = $1 RETURNING *`;
    const cancelResult = await pool.query(cancelQuery, [order_id]);

    res.status(200).json({ success: true, message: "Order canceled successfully.", order: cancelResult.rows[0] });
});

//rental history 
//rented products history by a user is in rental controller 

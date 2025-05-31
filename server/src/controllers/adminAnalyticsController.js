import pool from "../../dbConnect.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// Get total users by role(admin,seller,buyer)
export const totalUsers = asyncHandler(async (req, res) => {
    try {
        const result = await pool.query('SELECT role, COUNT(*) AS count FROM "Users" GROUP BY role');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching total users:', error);
        throw new ApiError('Failed to fetch total users', 500);
    }
});

// Get total orders by status(processing ,shipped, delivered ,cancelled)
export const totalOrders = asyncHandler(async (req, res) => {
    try {
        const result = await pool.query('SELECT status, COUNT(*) AS count FROM orders GROUP BY status');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching total orders:', error);
        throw new ApiError('Failed to fetch total orders', 500);
    }
});

// Get total revenue of current month  (daily, weekly, monthly)
export const totalRevenue = asyncHandler(async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                SUM(CASE WHEN created_at >= NOW() - INTERVAL '1 day' THEN total_amount ELSE 0 END) AS daily,
                SUM(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN total_amount ELSE 0 END) AS weekly,
                SUM(CASE WHEN created_at >= NOW() - INTERVAL '1 month' THEN total_amount ELSE 0 END) AS monthly
            FROM orders;
        `);
        if (!result.rows.length) {
            throw new ApiError('No revenue data available', 404);
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching total revenue:', error);
        throw new ApiError('Failed to fetch total revenue', 500);
    }
});

// Get total rentals and secondhand sales
export const totalTransactions = asyncHandler(async (req, res) => {
    try {
        const rentalCount = await pool.query("SELECT COUNT(*) AS count FROM rental WHERE rented_by IS NOT NULL OR rented_at IS NOT NULL");
        const secondhandCount = await pool.query("SELECT COUNT(*) AS count FROM order_item_id WHERE item_type = 'secondhand'");
        const totalProductSales = await pool.query("SELECT COUNT(*) AS count FROM order_item_id WHERE item_type = 'product'");
        
        res.json({
            rentals: rentalCount.rows[0].count,
            secondhandSales: secondhandCount.rows[0].count,
            totalProductSales: totalProductSales.rows[0].count
        });
    } catch (error) {
        console.error('Error fetching total transactions:', error);
        throw new ApiError('Failed to fetch total transactions', 500);
    }
});

// Get top-selling products
export const topSellingProduct = asyncHandler(async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT product_id, COUNT(*) AS total_sold FROM order_item_id GROUP BY product_id ORDER BY total_sold DESC LIMIT 5;
        `);
        if (!result.rows.length) {
            throw new ApiError('No top-selling products available', 404);
        }
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching top-selling products:', error);
        throw new ApiError('Failed to fetch top-selling products', 500);
    }
});

// Get top sellers
export const topSellers = asyncHandler(async (req, res) => {
    try {
        // Step 1: Get top-selling product IDs from order_item table
        const productResult = await pool.query(`
            SELECT product_id 
            FROM order_item_id
            GROUP BY product_id
            ORDER BY COUNT(*) DESC
            LIMIT 5;
        `);

        if (!productResult.rows.length) {
            throw new ApiError('No top-selling products found', 404);
        }

        // Extract product IDs as an array
        const topProductIds = productResult.rows.map(row => row.product_id);

        // Step 2: Get seller IDs based on top product IDs
        const sellersQuery = `
            SELECT DISTINCT user_id 
            FROM product
            WHERE product_id = ANY($1::int[]);
        `;
        const sellersResult = await pool.query(sellersQuery, [topProductIds]);

        if (!sellersResult.rows.length) {
            throw new ApiError('No top sellers found', 404);
        }

        // Extract seller IDs
        const topSellers = sellersResult.rows.map(row => row.user_id);

        res.status(200).json({ topSellers });
    } catch (error) {
        console.error('Error fetching top sellers:', error);
        throw new ApiError('Failed to fetch top sellers', 500);
    }
});

//get revenue of individual seller

export const revenueBySeller = asyncHandler(async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.user_id AS seller_id, u.name AS seller_name, SUM(o.total_amount) AS total_revenue
            FROM orders o
            JOIN order_item oi ON o.order_id = oi.order_id
            JOIN product p ON oi.product_id = p.product_id
            JOIN "Users" u ON p.user_id = u.user_id
            GROUP BY p.user_id, u.name
            ORDER BY total_revenue DESC;
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching revenue by seller:', error);
        throw new ApiError('Failed to fetch revenue by seller', 500);
    }
});



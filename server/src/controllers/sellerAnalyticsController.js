import pool from "../../dbConnect.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

//total products sold and rented that has been uploaded by the seller 
export const getTotalProductsSold = asyncHandler(async (req, res) => {
    const user_id  = req.user.user_id;
    
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT oi.product_id) AS total_products_sold,
          SUM(CASE WHEN p.condition = 'new' THEN 1 ELSE 0 END) AS new_products_sold,
          SUM(CASE WHEN p.condition = 'second-hand' THEN 1 ELSE 0 END) AS secondhand_products_sold
        FROM order_item oi
        JOIN product p ON oi.product_id = p.product_id
        JOIN orders o ON oi.order_id = o.order_id
        WHERE p.user_id = $1
        AND o.status = 'delivered';
      `;
      
      const result = await pool.query(query, [user_id ]);
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
      
//rental product count needs to be implemented but first i have to correct the orrderitem api to add rental orders in rental table.

//  Get product breakdown (new and secondhand product details) for the seller
export const productBreakdown=asyncHandler(async(req,res)=>{
    try {
        const userId = req.user.user_id;

        // Query to get the breakdown of products uploaded by the seller
        const query = `
            SELECT
                p.product_id,
                p.name,
                p.description,
                p.price,
                p.condition,
                p.stock_quantity,
                p.rental_available,
                p.product_image,
                COUNT(oi.product_id) AS items_sold,
                p.stock_quantity - COUNT(oi.product_id) AS items_left
            FROM
                product p
            LEFT JOIN
                order_item oi ON p.product_id = oi.product_id
            WHERE
                p.user_id = $1
            GROUP BY
                p.product_id, p.condition;
        `;

        const result = await pool.query(query, [userId]);

        if (result.rows.length > 0) {
            const newProducts = result.rows
                .filter(row => row.condition === 'new')
                .map(row => ({
                    product_id: row.product_id,
                    name: row.name,
                    description: row.description,
                    price: parseFloat(row.price),
                    stock_quantity: parseInt(row.stock_quantity),
                    rental_available: row.rental_available,
                    product_image: row.product_image,
                    items_sold: parseInt(row.items_sold || 0),
                    items_left: parseInt(row.items_left)
                }));

            const secondhandProducts = result.rows
                .filter(row => row.condition === 'second-hand')
                .map(row => ({
                    product_id: row.product_id,
                    name: row.name,
                    description: row.description,
                    price: parseFloat(row.price),
                    stock_quantity: parseInt(row.stock_quantity),
                    rental_available: row.rental_available,
                    product_image: row.product_image,
                    items_sold: parseInt(row.items_sold || 0),
                    items_left: parseInt(row.items_left)
                }));

            res.json({
                newProducts: newProducts,
                secondhandProducts: secondhandProducts
            });
        } else {
            res.json({ message: 'No products found for this seller' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//  Query to get monthly analytics of products sold and rental income for the seller

export const monthlyAnalytics=asyncHandler( async (req, res) => {
    try {
        const userId = req.user.user_id;

        const query = `
            SELECT
                DATE_TRUNC('month', o.created_at) AS month,
                SUM(CASE WHEN oi.item_type = 'product' OR oi.item_type = 'secondhand' THEN oi.quantity * oi.price_per_unit ELSE 0 END) AS product_sales,
                SUM(CASE WHEN oi.item_type = 'rental' THEN oi.quantity * oi.price_per_unit ELSE 0 END) AS rental_income
            FROM
                orders o
            JOIN
                order_item oi ON o.order_id = oi.order_id
            JOIN
                product p ON oi.product_id = p.product_id
            WHERE
                p.user_id = $1
            GROUP BY
                DATE_TRUNC('month', o.created_at)
            ORDER BY
                month;
        `;

        const result = await pool.query(query, [userId]);

        if (result.rows.length > 0) {
            const monthlyAnalytics = result.rows.map(row => ({
                month: row.month,
                product_sales: parseFloat(row.product_sales || 0),
                rental_income: parseFloat(row.rental_income || 0)
            }));

            res.json(monthlyAnalytics);
        } else {
            res.json({ message: 'No analytics data found for this seller' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


//  Update Order Status (seller Only)
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { order_id } = req.params;
// Example: "processing", "shipped", "delivered"
    const { status } = req.body; 

    if (!order_id) {
        throw new ApiError(400, "Order ID is required.");
    }

    if (!status) {
        throw new ApiError(400, "Status is required.");
    }

    const validStatuses = ["processing", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status value.");
    }

    // Ensure only admins can update order status
    if (req.user.role !== "seller") {
        throw new ApiError(403, "Only sellers can update order status.");
    }

    const updateQuery = `UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *`;
    const result = await pool.query(updateQuery, [status, order_id]);

    if (!result.rows.length) {
        throw new ApiError(404, "Order not found or status unchanged.");
    }

    res.status(200).json({ success: true, message: "Order status updated successfully.", order: result.rows[0] });
});

export const getAllOrders=asyncHandler(async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Query to get all orders placed by buyers for a particular seller's products
        const query = `
            SELECT
                o.order_id,
                o.user_id AS buyer_id,
                o.total_price,
                o.status,
                o.created_at,
                oi.product_id,
                oi.quantity,
                oi.price_per_unit
            FROM
                orders o
            JOIN
                order_item oi ON o.order_id = oi.order_id
            JOIN
                product p ON oi.product_id = p.product_id
            WHERE
                p.user_id = $1
            ORDER BY
                o.order_id;
        `;

        const result = await pool.query(query, [userId]);

        if (result.rows.length > 0) {
            const orders = result.rows.map(row => ({
                order_id: row.order_id,
                buyer_id: row.buyer_id,
                total_price: parseFloat(row.total_price),
                status: row.status,
                created_at: row.created_at,
                product_id: row.product_id,
                quantity: row.quantity,
                price_per_unit: parseFloat(row.price_per_unit)
            }));

            res.json(orders);
        } else {
            res.json({ message: 'No orders found for this seller' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


//rental history of product of a particular seller is in rental controller

 export const getProductRentalHistory=asyncHandler(async(req,res)=>{
    const {id:product_id}=req.params;

    if(!product_id){
        throw new ApiError(400,"Plz provide prodcut ID to fetch product's rental record")
    }

    const userID=req.user?.user_id;
    
    const userRole=req.user?.role;

    if(userRole!="seller" && userRole!=="admin"){
        throw new ApiError(403,"Access denied: Only sellers and admins can access this route")
    }

    const ownerQuery=`SELECT user_id FROM product WHERE product_id=$1`;
    const ownerResult=await pool.query(ownerQuery,[product_id]);

    if (ownerResult.rows.length === 0) {
        throw new ApiError(404, "Product not found.");
    }

    const productOwner=ownerResult.rows[0]?.user_id

    /*If the logged-in user is a seller but not the owner of the product, access is denied (403 Forbidden).
    Admins are allowed to bypass this check.*/
    
    if (userRole == "seller" && productOwner != userID) {
        throw new ApiError(403, `Access denied: Product ${product_id} is owned by another seller`);
    }

    const rentalQuery=`SELECT 
        r.rental_id,
        r.product_id,
        r.user_id AS product_listed_by,  
        U2.name AS product_listed_by, 
        r.rental_duration,
        r.rental_status,
        r.rental_price,
        r.return_date, 
        U.name AS product_rented_by,  
        p.name AS product_name,
        p.condition AS product_condition,
        c.category_id,
        c.category_name
    FROM rental r
    JOIN product p ON r.product_id = p.product_id
    JOIN category c ON p.category_id = c.category_id
    JOIN "Users" U ON r.rented_by = U.user_id  -- Get Buyer's name
    JOIN "Users" U2 ON r.user_id = U2.user_id  -- Get Seller's name
    WHERE r.product_id = $1;`

    const findProductRentalRecord=await pool.query(rentalQuery,[product_id]);

    if(findProductRentalRecord.rows.length==0){
        throw new ApiError(404, "No rental records found for this product.");
    }

    const productRentalHistory=findProductRentalRecord.rows;

    return res.status(200).json(new ApiResponse(200,{productRentalHistory},"Product rental hstory fetched"))

})

//second hand products listed by a particular seller is in secondhand controller

export const getUserSecondhandProducts = asyncHandler(async (req, res) => {
    const { id:user_id } = req.params;
    
    const secondHandByUser = await pool.query(
        `SELECT  
            p.user_id AS product_owner_id,  -- user_id from product table
            p.name,
            p.description,
            p.price,
            p.stock_quantity,
            p.rental_available,
            p.product_features,
            p.product_image,
            U.user_id AS user_id_from_users, -- user_id from Users table
            U.name AS product_listed_by
        FROM product p
        LEFT JOIN "Users" U ON p.user_id = U.user_id
        WHERE p.user_id = $1`,
        [user_id]
    );

    const response=secondHandByUser.rows;

    res.status(200).json(new ApiResponse(200,{response},"Products fetched successfully"));
});



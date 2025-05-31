import pool from "../../dbConnect.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const placeOrder = asyncHandler(async (req, res) => {
    // Use the isLoggedIn middleware to get the user from the request
    const user = req.user;
    
    if (!user) {
      throw new ApiError(401, "Unauthorized: User not found in request. Ensure you are logged in.");
    }
    
    const user_id = user.user_id;
    const { status = 'processing' } = req.body;
    
    // Fetch cart items for the user
    const cartQuery = 'SELECT * FROM cart WHERE user_id = $1';
    const cartValues = [user_id];
    const cartResult = await pool.query(cartQuery, cartValues);
    const cartItems = cartResult.rows;
    
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty. Add items to cart before placing an order.' });
    }
    
    // Calculate the total amount from cart items
    const total_amount = cartItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
    
    // Start a database transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create a new order in the orders table
      const orderQuery = `
        INSERT INTO orders (user_id, total_amount, status)
        VALUES ($1, $2, $3)
        RETURNING order_id
      `;
      const orderValues = [user_id, total_amount, status];
      const orderResult = await client.query(orderQuery, orderValues);
      const order_id = orderResult.rows[0].order_id;
      
      // Process cart items
      for (const cartItem of cartItems) {
        const orderItemQuery = `
          INSERT INTO order_item (order_id, product_id, quantity, price, total_price, rental_days, is_rental)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING order_item_id
        `;
        const orderItemValues = [
          order_id,
          cartItem.product_id,
          cartItem.quantity,
          cartItem.is_rental ? cartItem.rental_price : cartItem.price,
          parseFloat(cartItem.total_price),
          cartItem.rental_days || null,
          cartItem.is_rental
        ];
        await client.query(orderItemQuery, orderItemValues);
        
        // If the item is a rental, handle rental record
        if (cartItem.is_rental === true) {
          // Calculate return date based on rental days + 2 days for delivery
          const currentDate = new Date();
          const returnDate = new Date();
          returnDate.setDate(currentDate.getDate() + cartItem.rental_days + 2);
          
          // Check if this product already has a rental with rented_by filled
          const checkRentalQuery = `
            SELECT rental_id FROM rental 
            WHERE product_id = $1 AND rented_by IS NOT NULL
            LIMIT 1
          `;
          const checkRentalResult = await client.query(checkRentalQuery, [cartItem.product_id]);
          
          if (checkRentalResult.rows.length > 0) {
            // Product already has a rental record with rented_by filled, create a new record
            const insertRentalQuery = `
              INSERT INTO rental (
                product_id,
                user_id,
                rental_price,
                rental_duration,
                rental_status,
                created_at,
                return_date,
                rented_by,
                rented_at
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `;
            const insertRentalValues = [
              cartItem.product_id,
              user_id,
              cartItem.rental_price,
              cartItem.rental_days,
              'Rented', // Adjust this value based on your valid rental_status values
              currentDate,
              returnDate,
              user_id,
              currentDate
            ];
            await client.query(insertRentalQuery, insertRentalValues);
          } else {
            // No existing rental with rented_by filled, update the existing record
            const updateRentalQuery = `
              UPDATE rental 
              SET 
                rental_price = $1,
                rental_duration = $2,
                rental_status = $3,
                return_date = $4,
                rented_by = $5,
                rented_at = $6,
                user_id = $7
              WHERE product_id = $8
            `;
            const updateRentalValues = [
              cartItem.rental_price,
              cartItem.rental_days,
              'Rented', // Adjust this value based on your valid rental_status values
              returnDate,
              user_id,
              currentDate,
              user_id,
              cartItem.product_id
            ];
            await client.query(updateRentalQuery, updateRentalValues);
          }
        }
        
        // Decrease product quantity in the product table
        const updateProductQuery = `
          UPDATE product
          SET stock_quantity = stock_quantity - $1
          WHERE product_id = $2
        `;
        const updateProductValues = [cartItem.quantity, cartItem.product_id];
        await client.query(updateProductQuery, updateProductValues);
      }
      
      // Clear the user's cart after placing the order
      const deleteCartQuery = 'DELETE FROM cart WHERE user_id = $1';
      await client.query(deleteCartQuery, [user_id]);
      
      // Commit the transaction
      await client.query('COMMIT');
      
      return res.status(201).json({ message: 'Order placed successfully.', order_id: order_id });
    } catch (error) {
      // Rollback the transaction if any error occurred
      await client.query('ROLLBACK');
      console.error('Transaction failed:', error);
      return res.status(500).json({ message: 'Failed to place order.', error: error.message });
    } finally {
      client.release();
    }
  });


//     const user_id=user.user_id;
//     if (!user_id) {
//         throw new ApiError(400, "User ID is required.");
//     }

//     const query = `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`;
//     const result = await pool.query(query, [user_id]);

//     if (!result.rows.length) {
//         // throw new ApiError(404, "No orders found for this user.");
//         return res.status(200).json({ 
//             success: true, 
//             orders: [],
//             message: "No orders found" 
//         });
//     }

//     res.status(200).json({ success: true, orders: result.rows });
// });


// Get Order Details
export const getOrderDetails = asyncHandler(async (req, res) => {
    const { order_id } = req.params;

    if (!order_id) {
        throw new ApiError(400, "Order ID is required.");
    }

    const query = `
        SELECT oi.*, p.name AS product_name 
        FROM order_item oi
        JOIN product p ON oi.product_id = p.product_id
        WHERE oi.order_id = $1
    `;
    const result = await pool.query(query, [order_id]);

    if (!result.rows.length) {
        throw new ApiError(404, "Order details not found.");
    }

    res.status(200).json({ success: true, orderItems: result.rows });
});


//  Get Order Status
export const getOrderStatus = asyncHandler(async (req, res) => {
    const { order_id } = req.params;

    if (!order_id) {
        throw new ApiError(400, "Order ID is required.");
    }

    const query = `SELECT order_id, status FROM orders WHERE order_id = $1`;
    const result = await pool.query(query, [order_id]);

    if (!result.rows.length) {
        throw new ApiError(404, "Order not found.");
    }

    res.status(200).json({ success: true, orderStatus: result.rows[0] });
});
export const getUserOrders = asyncHandler(async (req, res) => {
  const user = req.user;
  
  if (!user) {
      throw new ApiError(401, "Unauthorized");
  }

  // Get all orders for the user
  const ordersQuery = `
      SELECT o.order_id, o.total_amount, o.status, o.created_at
      FROM orders o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
  `;
  const ordersResult = await pool.query(ordersQuery, [user.user_id]);
  const orders = ordersResult.rows;

  // Get order items for each order
  for (const order of orders) {
      const itemsQuery = `
          SELECT oi.*, p.name AS product_name,
          p.product_image AS product_image
          FROM order_item oi
          JOIN product p ON oi.product_id = p.product_id
          WHERE oi.order_id = $1
      `;
      const itemsResult = await pool.query(itemsQuery, [order.order_id]);
      
      // Transform order items with formatted image URLs
      order.items = itemsResult.rows.map(item => ({
          ...item,
          product_image: item.product_image?.includes('cloudinary.com') 
              ? `${item.product_image}?w=150&h=150&c=fill` 
              : item.product_image
      }));
  }

  res.status(200).json({ success: true, orders });
});

// orderController.js
export const cancelOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  const { order_id } = req.params;

  if (!user) {
      throw new ApiError(401, "Unauthorized");
  }

  // Add logging to debug the issue
  console.log(`Attempting to cancel order ${order_id} for user ${user.user_id}`);

  // Validate order_id
  if (!order_id || isNaN(parseInt(order_id))) {
      throw new ApiError(400, "Invalid order ID");
  }

  // Check if order exists and belongs to user
  const orderCheck = await pool.query(
      'SELECT user_id, status FROM orders WHERE order_id = $1',
      [order_id]
  );

  console.log(`Order check result: ${JSON.stringify(orderCheck.rows)}`);

  if (orderCheck.rows.length === 0) {
      throw new ApiError(404, "Order not found");
  }

  const orderData = orderCheck.rows[0];
  
  console.log(`Order status: ${orderData.status}, Owner: ${orderData.user_id}, Requester: ${user.user_id}`);

  if (orderData.user_id !== user.user_id) {
      throw new ApiError(403, "Not authorized to cancel this order");
  }

  // Check status (case-insensitive)
  const status = orderData.status.toLowerCase();
  if (status !== "processing") {
      throw new ApiError(400, `Only processing orders can be cancelled. Current status: ${orderData.status}`);
  }

  // Start transaction
  const client = await pool.connect();
  try {
      await client.query('BEGIN');

      // Update order status
      await client.query(
          'UPDATE orders SET status = $1 WHERE order_id = $2',
          ['cancelled', order_id]
      );

      // Get order items
      const itemsQuery = 'SELECT * FROM order_item WHERE order_id = $1';
      const itemsResult = await client.query(itemsQuery, [order_id]);
      const items = itemsResult.rows;

      console.log(`Found ${items.length} items for order ${order_id}`);

      for (const item of items) {
          // Restore product quantity
          await client.query(
              'UPDATE product SET stock_quantity = stock_quantity + $1 WHERE product_id = $2',
              [item.quantity, item.product_id]
          );
          console.log(`Restored ${item.quantity} units of product ${item.product_id}`);

          // If rental, update rental status
          if (item.is_rental) {
              const rentalResult = await client.query(
                  `UPDATE rental 
                   SET rental_status = 'Available', rented_by = NULL, rented_at = NULL 
                   WHERE product_id = $1 AND rented_by = $2
                   RETURNING rental_id`,
                  [item.product_id, user.user_id]
              );
              console.log(`Updated ${rentalResult.rowCount} rental records for product ${item.product_id}`);
          }
      }

      await client.query('COMMIT');
      console.log(`Successfully cancelled order ${order_id}`);
      res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error cancelling order:', error);
      throw new ApiError(500, `Failed to cancel order: ${error.message}`);
  } finally {
      client.release();
  }
});


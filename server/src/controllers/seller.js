
import  pool from '../../dbConnect.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {setupSocketServer}from '../utils/socket.js'

// Dashboard Overview API - Total sales, orders, products and metrics
export const dashboardSeller=asyncHandler(async (req, res) => {
  const sellerId = req.user?.user_id;

  // Get total orders
  const orderQuery = `
    SELECT COUNT(*) as total_orders
    FROM orders o
    JOIN order_item oi ON o.order_id = oi.order_id
    JOIN product p ON oi.product_id = p.product_id
    WHERE p.user_id = $1
  `;

  const getSellerOrders =`
  SELECT product_name as product.name
    FROM orders o
    JOIN order_item oi ON o.order_id = oi.order_id
    JOIN product p ON oi.product_id = p.product_id
    WHERE p.user_id = $1
  `;
  
  // Get total sales
  const salesQuery = `
    SELECT COALESCE(SUM(oi.total_price), 0) as total_sales
    FROM orders o
    JOIN order_item oi ON o.order_id = oi.order_id
    JOIN product p ON oi.product_id = p.product_id
    WHERE p.user_id = $1
  `;
  
  // Get total products sold (quantity)
  const productsSoldQuery = `
    SELECT COALESCE(SUM(oi.quantity), 0) as total_products_sold
    FROM order_item oi
    JOIN product p ON oi.product_id = p.product_id
    WHERE p.user_id = $1
  `;
  
  // Get total products listed
  const productsListedQuery = `
    SELECT COUNT(*) as total_products_listed
    FROM product
    WHERE user_id = $1
  `;
  
  // Get rental metrics
  const rentalMetricsQuery = `
    SELECT COUNT(*) as total_rentals,
           COALESCE(SUM(rental_price), 0) as total_rental_revenue
    FROM rental
    JOIN product p ON rental.product_id = p.product_id
    WHERE p.user_id = $1 AND rental.rented_by IS NOT NULL
  `;

  // Execute all queries in parallel
  const [
    orderResult, 
    salesResult, 
    productsSoldResult, 
    productsListedResult,
    rentalMetricsResult
  ] = await Promise.all([
    pool.query(orderQuery, [sellerId]),
    pool.query(salesQuery, [sellerId]),
    pool.query(productsSoldQuery, [sellerId]),
    pool.query(productsListedQuery, [sellerId]),
    pool.query(rentalMetricsQuery, [sellerId])
  ]);

  // Calculate rental vs direct sales ratio
  const totalSales = parseFloat(salesResult.rows[0].total_sales) || 0;
  const rentalRevenue = parseFloat(rentalMetricsResult.rows[0].total_rental_revenue) || 0;
  const totalRevenue = totalSales + rentalRevenue;
  
  // Current month revenue
  const currentMonthQuery = `
    SELECT COALESCE(SUM(oi.total_price), 0) as current_month_revenue
    FROM orders o
    JOIN order_item oi ON o.order_id = oi.order_id
    JOIN product p ON oi.product_id = p.product_id
    WHERE p.user_id = $1
    AND DATE_TRUNC('month', o.created_at) = DATE_TRUNC('month', CURRENT_DATE)
  `;
  
  const currentMonthResult = await pool.query(currentMonthQuery, [sellerId]);

  // Response with all analytics data
  res.status(200).json({
    success: true,
    data: {
      total_orders: parseInt(orderResult.rows[0].total_orders),
      total_sales: totalSales,
      total_products_sold: parseInt(productsSoldResult.rows[0].total_products_sold),
      total_products_listed: parseInt(productsListedResult.rows[0].total_products_listed),
      rental_metrics: {
        total_rentals: parseInt(rentalMetricsResult.rows[0].total_rentals),
        total_rental_revenue: rentalRevenue
      },
      total_revenue: totalRevenue,
      current_month_revenue: parseFloat(currentMonthResult.rows[0].current_month_revenue) || 0
    }
  });
});

// Revenue Report API - Daily revenue breakdown
 export const revenueReport=asyncHandler(async (req, res) => {
  const sellerId = req.user?.user_id;
  const { startDate, endDate } = req.query;
  
  // Default to last 30 days if no dates provided
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();
  
  // Daily revenue query
  const dailyRevenueQuery = `
    SELECT 
      DATE(o.created_at) as date,
      COALESCE(SUM(oi.total_price), 0) as daily_revenue,
      COUNT(DISTINCT o.order_id) as orders_count
    FROM orders o
    JOIN order_item oi ON o.order_id = oi.order_id
    JOIN product p ON oi.product_id = p.product_id
    WHERE p.user_id = $1
    AND o.created_at BETWEEN $2 AND $3
    GROUP BY DATE(o.created_at)
    ORDER BY date
  `;
  
  // Daily rental revenue query
  const dailyRentalQuery = `
    SELECT 
      DATE(r.rented_at) as date,
      COALESCE(SUM(r.rental_price), 0) as daily_rental_revenue,
      COUNT(*) as rentals_count
    FROM rental r
    JOIN product p ON r.product_id = p.product_id
    WHERE p.user_id = $1
    AND r.rented_at BETWEEN $2 AND $3
    AND r.rented_by IS NOT NULL
    GROUP BY DATE(r.rented_at)
    ORDER BY date
  `;
  
  // Execute queries
  const [revenueResult, rentalResult] = await Promise.all([
    pool.query(dailyRevenueQuery, [sellerId, start, end]),
    pool.query(dailyRentalQuery, [sellerId, start, end])
  ]);
  
  // Combine revenues by date
  const revenueByDate = {};
  
  // Process regular sales
  revenueResult.rows.forEach(row => {
    const dateStr = row.date.toISOString().split('T')[0];
    revenueByDate[dateStr] = {
      date: dateStr,
      sales_revenue: parseFloat(row.daily_revenue) || 0,
      orders_count: parseInt(row.orders_count),
      rental_revenue: 0,
      rentals_count: 0,
      total_revenue: parseFloat(row.daily_revenue) || 0
    };
  });
  
  // Process rental revenues
  rentalResult.rows.forEach(row => {
    const dateStr = row.date.toISOString().split('T')[0];
    if (revenueByDate[dateStr]) {
      revenueByDate[dateStr].rental_revenue = parseFloat(row.daily_rental_revenue) || 0;
      revenueByDate[dateStr].rentals_count = parseInt(row.rentals_count);
      revenueByDate[dateStr].total_revenue += parseFloat(row.daily_rental_revenue) || 0;
    } else {
      revenueByDate[dateStr] = {
        date: dateStr,
        sales_revenue: 0,
        orders_count: 0,
        rental_revenue: parseFloat(row.daily_rental_revenue) || 0,
        rentals_count: parseInt(row.rentals_count),
        total_revenue: parseFloat(row.daily_rental_revenue) || 0
      };
    }
  });
  
  // Convert to array and sort by date
  const revenueReport = Object.values(revenueByDate).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  res.status(200).json({
    success: true,
    data: {
      revenue_report: revenueReport
    }
  });
});

// Top Products API - Best selling and most rented products
export const topProducts=asyncHandler(async (req, res) => {
  const sellerId = req.user?.user_id;
  const limit = req.query.limit || 10;
  
  // Top selling products
  const topSellingQuery = `
    SELECT 
      p.product_id,
      p.name,
      p.price,
      SUM(oi.quantity) as total_quantity_sold,
      SUM(oi.total_price) as total_revenue,
      COUNT(DISTINCT o.order_id) as orders_count
    FROM product p
    JOIN order_item oi ON p.product_id = oi.product_id
    JOIN orders o ON oi.order_id = o.order_id
    WHERE p.user_id = $1 AND oi.is_rental = false
    GROUP BY p.product_id, p.name, p.price
    ORDER BY total_revenue DESC
    LIMIT $2
  `;
  
  // Top rented products
  const topRentedQuery = `
    SELECT 
      p.product_id,
      p.name,
      COUNT(r.rental_id) as rental_count,
      SUM(r.rental_price) as rental_revenue
    FROM product p
    JOIN rental r ON p.product_id = r.product_id
    WHERE p.user_id = $1 AND r.rented_by IS NOT NULL
    GROUP BY p.product_id, p.name
    ORDER BY rental_count DESC
    LIMIT $2
  `;
  
  // Execute queries
  const [topSellingResult, topRentedResult] = await Promise.all([
    pool.query(topSellingQuery, [sellerId, limit]),
    pool.query(topRentedQuery, [sellerId, limit])
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      top_selling_products: topSellingResult.rows.map(row => ({
        product_id: row.product_id,
        name: row.name,
        price: parseFloat(row.price),
        total_quantity_sold: parseInt(row.total_quantity_sold),
        total_revenue: parseFloat(row.total_revenue),
        orders_count: parseInt(row.orders_count)
      })),
      top_rented_products: topRentedResult.rows.map(row => ({
        product_id: row.product_id,
        name: row.name,
        rental_count: parseInt(row.rental_count),
        rental_revenue: parseFloat(row.rental_revenue)
      }))
    }
  });
});

// Product Rating Summary API
 export const ratingSummary=asyncHandler(async (req, res) => {
  const sellerId = req.user?.user_id;
  
  // Overall rating summary
  const overallRatingQuery = `
    SELECT 
      AVG(r.rating) as average_rating,
      COUNT(r.rating) as total_reviews,
      COUNT(CASE WHEN r.rating = 5 THEN 1 END) as five_star,
      COUNT(CASE WHEN r.rating = 4 THEN 1 END) as four_star,
      COUNT(CASE WHEN r.rating = 3 THEN 1 END) as three_star,
      COUNT(CASE WHEN r.rating = 2 THEN 1 END) as two_star,
      COUNT(CASE WHEN r.rating = 1 THEN 1 END) as one_star
    FROM reviewrating r
    JOIN product p ON r.product_id = p.product_id
    WHERE p.user_id = $1
  `;
  
  // Product-specific ratings
  const productRatingsQuery = `
    SELECT 
      p.product_id,
      p.name,
      AVG(r.rating) as average_rating,
      COUNT(r.rating) as review_count
    FROM product p
    LEFT JOIN reviewrating r ON p.product_id = r.product_id
    WHERE p.user_id = $1
    GROUP BY p.product_id, p.name
    ORDER BY average_rating DESC, review_count DESC
  `;
  
  // Execute queries
  const [overallResult, productRatingsResult] = await Promise.all([
    pool.query(overallRatingQuery, [sellerId]),
    pool.query(productRatingsQuery, [sellerId])
  ]);
  
  // Calculate percentage for each star rating
  const totalReviews = parseInt(overallResult.rows[0].total_reviews) || 0;
  const ratingBreakdown = {
    five_star: {
      count: parseInt(overallResult.rows[0].five_star) || 0,
      percentage: totalReviews ? (parseInt(overallResult.rows[0].five_star) / totalReviews * 100).toFixed(1) : 0
    },
    four_star: {
      count: parseInt(overallResult.rows[0].four_star) || 0,
      percentage: totalReviews ? (parseInt(overallResult.rows[0].four_star) / totalReviews * 100).toFixed(1) : 0
    },
    three_star: {
      count: parseInt(overallResult.rows[0].three_star) || 0,
      percentage: totalReviews ? (parseInt(overallResult.rows[0].three_star) / totalReviews * 100).toFixed(1) : 0
    },
    two_star: {
      count: parseInt(overallResult.rows[0].two_star) || 0,
      percentage: totalReviews ? (parseInt(overallResult.rows[0].two_star) / totalReviews * 100).toFixed(1) : 0
    },
    one_star: {
      count: parseInt(overallResult.rows[0].one_star) || 0,
      percentage: totalReviews ? (parseInt(overallResult.rows[0].one_star) / totalReviews * 100).toFixed(1) : 0
    }
  };
  
  res.status(200).json({
    success: true,
    data: {
      overall_rating: {
        average: parseFloat(overallResult.rows[0].average_rating) || 0,
        total_reviews: totalReviews,
        rating_breakdown: ratingBreakdown
      },
      product_ratings: productRatingsResult.rows.map(row => ({
        product_id: row.product_id,
        name: row.name,
        average_rating: parseFloat(row.average_rating) || 0,
        review_count: parseInt(row.review_count) || 0
      }))
    }
  });
});

// Order Status API
export const orderBreakdown=asyncHandler(async (req, res) => {
  const sellerId = req.user?.user_id;
  
  // Order status breakdown
  const orderStatusQuery = `
    SELECT 
      o.status,
      COUNT(*) as count
    FROM orders o
    JOIN order_item oi ON o.order_id = oi.order_id
    JOIN product p ON oi.product_id = p.product_id
    WHERE p.user_id = $1
    GROUP BY o.status
  `;
  
  // Recent orders
  const recentOrdersQuery = `
    SELECT 
      o.order_id,
      o.created_at,
      o.status,
      u.user_id as customer_id,
      u.name as customer_name,
      p.product_id,
      p.name as product_name,
      oi.quantity,
      oi.total_price,
      oi.is_rental
    FROM orders o
    JOIN order_item oi ON o.order_id = oi.order_id
    JOIN product p ON oi.product_id = p.product_id
    JOIN "Users" u ON o.user_id = u.user_id
    WHERE p.user_id = $1
    ORDER BY o.created_at DESC
    LIMIT 10
  `;
  
  // Execute queries
  const [statusResult, recentOrdersResult] = await Promise.all([
    pool.query(orderStatusQuery, [sellerId]),
    pool.query(recentOrdersQuery, [sellerId])
  ]);
  
  // Transform status data for chart representation
  const statusData = statusResult.rows.reduce((acc, row) => {
    acc[row.status] = parseInt(row.count);
    return acc;
  }, {});
  
  res.status(200).json({
    success: true,
    data: {
      order_status_breakdown: statusData,
      recent_orders: recentOrdersResult.rows.map(row => ({
        order_id: row.order_id,
        created_at: row.created_at,
        status: row.status,
        customer: {
          id: row.customer_id,
          name: row.customer_name
        },
        product: {
          id: row.product_id,
          name: row.product_name
        },
        quantity: parseInt(row.quantity),
        total_price: parseFloat(row.total_price),
        is_rental: row.is_rental
      }))
    }
  });
});

// All Orders API with pagination
 export const orderPagination=asyncHandler(async (req, res) => {
  const sellerId = req.user.user_id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const status = req.query.status; // Optional filter by status
  
  // Build query with optional status filter
  let orderQuery = `
    SELECT DISTINCT
      o.order_id,
      o.created_at,
      o.status,
      o.total_amount,
      u.user_id as customer_id,
      u.name as customer_name
    FROM orders o
    JOIN order_item oi ON o.order_id = oi.order_id
    JOIN product p ON oi.product_id = p.product_id
    JOIN "Users" u ON o.user_id = u.user_id
    WHERE p.user_id = $1
  `;
  
  const queryParams = [sellerId];
  
  if (status) {
    orderQuery += ` AND o.status = $2`;
    queryParams.push(status);
  }
  
  orderQuery += `
    ORDER BY o.created_at DESC
    LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
  `;
  
  // Count query for pagination
  let countQuery = `
    SELECT COUNT(DISTINCT o.order_id) as total
    FROM orders o
    JOIN order_item oi ON o.order_id = oi.order_id
    JOIN product p ON oi.product_id = p.product_id
    WHERE p.user_id = $1
  `;
  
  if (status) {
    countQuery += ` AND o.status = $2`;
  }
  
  // Execute queries
  const [ordersResult, countResult] = await Promise.all([
    pool.query(orderQuery, [...queryParams, limit, offset]),
    pool.query(countQuery, status ? [sellerId, status] : [sellerId])
  ]);
  
  const totalOrders = parseInt(countResult.rows[0].total);
  const totalPages = Math.ceil(totalOrders / limit);
  
  res.status(200).json({
    success: true,
    data: {
      orders: ordersResult.rows.map(row => ({
        order_id: row.order_id,
        created_at: row.created_at,
        status: row.status,
        total_amount: parseFloat(row.total_amount),
        customer: {
          id: row.customer_id,
          name: row.customer_name
        }
      })),
      pagination: {
        total_orders: totalOrders,
        total_pages: totalPages,
        current_page: page,
        has_next_page: page < totalPages,
        has_previous_page: page > 1
      }
    }
  });
});

// Get Order Details API
export const orderDetails=asyncHandler(async (req, res) => {
  const sellerId = req.user?.user_id;
  const { orderId } = req.params;
  
  // Fetch order details
  const orderQuery = `
    SELECT 
      o.order_id,
      o.created_at,
      o.status,
      o.total_amount,
      u.user_id as customer_id,
      u.name as customer_name,
      u.email as customer_email,
      u.address as customer_address,
      u."phoneNo" as customer_phone
    FROM orders o
    JOIN "Users" u ON o.user_id = u.user_id
    WHERE o.order_id = $1
  `;
  
  // Fetch order items
  const orderItemsQuery = `
    SELECT 
      oi.order_item_id,
      oi.product_id,
      p.name as product_name,
      p.description as product_description,
      p.product_image,
      oi.quantity,
      oi.price,
      oi.total_price,
      oi.is_rental,
      oi.rental_days
    FROM order_item oi
    JOIN product p ON oi.product_id = p.product_id
    WHERE oi.order_id = $1 AND p.user_id = $2
  `;
  
  // Execute queries
  const [orderResult, orderItemsResult] = await Promise.all([
    pool.query(orderQuery, [orderId]),
    pool.query(orderItemsQuery, [orderId, sellerId])
  ]);
  
  if (orderResult.rows.length === 0 || orderItemsResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Order not found or it does not belong to this seller'
    });
  }
  
  const order = orderResult.rows[0];
  
  res.status(200).json({
    success: true,
    data: {
      order: {
        id: order.order_id,
        created_at: order.created_at,
        status: order.status,
        total_amount: parseFloat(order.total_amount),
        customer: {
          id: order.customer_id,
          name: order.customer_name,
          email: order.customer_email,
          address: order.customer_address,
          phone: order.customer_phone
        }
      },
      items: orderItemsResult.rows.map(item => ({
        order_item_id: item.order_item_id,
        product: {
          id: item.product_id,
          name: item.product_name,
          description: item.product_description,
          image: item.product_image
        },
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price),
        total_price: parseFloat(item.total_price),
        is_rental: item.is_rental,
        rental_days: item.rental_days ? parseInt(item.rental_days) : null
      }))
    }
  });
});

// Update Order Status API
 export const updateStatus=asyncHandler(async (req, res) => {
  const sellerId = req.user.user_id;
  const { orderId } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required'
    });
  }
  
  // Verify seller owns products in this order
  const verifySellerQuery = `
    SELECT COUNT(*) as count
    FROM order_item oi
    JOIN product p ON oi.product_id = p.product_id
    WHERE oi.order_id = $1 AND p.user_id = $2
  `;
  
  const verifyResult = await pool.query(verifySellerQuery, [orderId, sellerId]);
  
  if (parseInt(verifyResult.rows[0].count) === 0) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to update this order'
    });
  }
  
  // Update order status
  const updateQuery = `
    UPDATE orders 
    SET status = $1
    WHERE order_id = $2
    RETURNING order_id, status
  `;
  
  const updateResult = await pool.query(updateQuery, [status, orderId]);
  
  if (updateResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  const updatedOrder = updateResult.rows[0];
  
  // Get order details for socket update
  const orderDetailsQuery = `
    SELECT 
      o.order_id,
      o.user_id as customer_id,
      o.status,
      o.total_amount,
      u.name as customer_name
    FROM orders o
    JOIN "Users" u ON o.user_id = u.user_id
    WHERE o.order_id = $1
  `;
  
  const orderDetails = await pool.query(orderDetailsQuery, [orderId]);
  
//   // Emit update to all connected clients for this seller
  if (req.app.get('io')) {
    const io = req.app.get('io');
    io.to(`seller-${sellerId}`).emit('order-status-update', {
      order_id: updatedOrder.order_id,
      status: updatedOrder.status
    });
    
    // Also notify the customer
    const customerId = orderDetails.rows[0].customer_id;
    io.to(`customer-${customerId}`).emit('order-status-update', {
      order_id: updatedOrder.order_id,
      status: updatedOrder.status
    });
  }
  
  res.status(200).json({
    success: true,
    data: {
      order_id: updatedOrder.order_id,
      status: updatedOrder.status
    }
  });
});

export const ordersByQuery = asyncHandler(async (req, res) => {
  const sellerId = req.user?.user_id;
  const { page = 1, limit = 10, status = null } = req.body;
  const offset = (page - 1) * limit;
  
  // Base query - using the same structure as the total_orders count query
  // but selecting the specific order details we need
  let orderQuery = `
    SELECT DISTINCT
      o.order_id,
      o.created_at,
      o.status,
      o.total_amount,
      u.user_id as customer_id,
      u.name as customer_name
    FROM orders o
    JOIN order_item oi ON o.order_id = oi.order_id
    JOIN product p ON oi.product_id = p.product_id
    JOIN "Users" u ON o.user_id = u.user_id
    WHERE p.user_id = $1
  `;
  
  const queryParams = [sellerId];
  let paramIndex = 2;
  
  // Add status filter if provided
  if (status) {
    orderQuery += ` AND o.status = $${paramIndex}`;
    queryParams.push(status);
    paramIndex++;
  }
  
  // Add order by, limit and offset
  orderQuery += `
    ORDER BY o.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  queryParams.push(limit, offset);
  
  // Count query - this is the exact same structure as the total_orders query
  // but we're counting distinct order_ids to match the pagination
  let countQuery = `
    SELECT COUNT(DISTINCT o.order_id) as total
    FROM orders o
    JOIN order_item oi ON o.order_id = oi.order_id
    JOIN product p ON oi.product_id = p.product_id
    WHERE p.user_id = $1
  `;
  
  // Add status filter to count query if provided
  if (status) {
    countQuery += ` AND o.status = $2`;
  }
  
  try {
    // Execute queries
    const [ordersResult, countResult] = await Promise.all([
      pool.query(orderQuery, queryParams),
      pool.query(countQuery, status ? [sellerId, status] : [sellerId])
    ]);
    
    const totalOrders = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalOrders / limit);
    
    res.status(200).json({
      success: true,
      data: {
        orders: ordersResult.rows.map(row => ({
          order_id: row.order_id,
          created_at: row.created_at,
          status: row.status,
          total_amount: parseFloat(row.total_amount),
          customer: {
            id: row.customer_id,
            name: row.customer_name
          }
        })),
        pagination: {
          total_orders: totalOrders,
          total_pages: totalPages,
          current_page: parseInt(page),
          has_next_page: parseInt(page) < totalPages,
          has_previous_page: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
});


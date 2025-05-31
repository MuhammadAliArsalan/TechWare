import { Server } from "socket.io";
import pkg from 'pg';
import pool from "../../dbConnect.js";
import dotenv from "dotenv"; 

dotenv.config();

const { Client } = pkg;

let io; // Declare io globally so it can be accessed inside pgClient event

// Setup Socket.io server
export const setupSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join seller-specific room
    socket.on("join-seller-room", (sellerId) => {
      socket.join(`seller-${sellerId}`);
      console.log(`Seller ${sellerId} joined their room`);
    });

    // Join customer-specific room
    socket.on("join-customer-room", (customerId) => {
      socket.join(`customer-${customerId}`);
      console.log(`Customer ${customerId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  listenForNewOrders(); // FIX: No need to pass io, because io is global now

  return io;
};

// Listen for new orders via Postgres NOTIFY
const listenForNewOrders = () => {
  const pgClient = new Client({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    ssl: {
      rejectUnauthorized: false
    }
  });

  pgClient.connect()
    .then(() => {
      console.log("Postgres notification client connected");
      return pgClient.query('LISTEN new_order');
    })
    .catch((err) => {
      console.error("Error connecting pgClient for notifications:", err.message);
    });

  pgClient.on('notification', async (notification) => {
    try {
      const payload = JSON.parse(notification.payload);
      const orderId = payload.order_id;

      const orderQuery = `
        SELECT 
          o.order_id,
          o.status,
          o.total_amount,
          o.created_at,
          u.user_id as customer_id,
          u.name as customer_name,
          p.user_id as seller_id
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        JOIN order_item oi ON o.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE o.order_id = $1
      `;

      const { rows } = await pool.query(orderQuery, [orderId]);

      if (rows.length > 0) {
        const order = rows[0];

        // Emit socket event
        io.to(`seller-${order.seller_id}`).emit("new-order", {
          order_id: order.order_id,
          status: order.status,
          total_amount: parseFloat(order.total_amount),
          created_at: order.created_at,
          customer: {
            id: order.customer_id,
            name: order.customer_name
          }
        });
      }
    } catch (error) {
      console.error("Error processing new_order notification:", error);
    }
  });

  // Optional: handle pgClient errors
  pgClient.on('error', (err) => {
    console.error('Postgres notification client error:', err.message);
  });
};

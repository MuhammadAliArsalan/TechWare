import express from "express";
import http from "http"; // ADD THIS
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./src/routes/userRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import validationRoutes from "./src/routes/verifyProdutcRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
// import secondHandRoutes from "./src/routes/secondHandRoutes.js";
import rentalRoutes from "./src/routes/rentalRoutes.js";
import adminRoutes from "./src/routes/adminDashboardRoutes.js";
import sellerRoutes from "./src/routes/sellerRoutes.js";
import buyerRoutes from "./src/routes/buyerRoutes.js";
import pool from "./dbConnect.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";

// ADD THIS: Import Socket Server Setup
import { setupSocketServer } from "./src/utils/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app); // Change from app.listen to http.createServer
const PORT = process.env.PORT || 5000;

// Middlewares
pool.connect()
  .then(() => console.log('Connected to supabase!'))
  .catch(err => console.error('Database connection error:', err.message));

// app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true // Allow credentials
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Backend is running!");
});
app.use("/api/users",userRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
// app.use("/api/secondHand", secondHandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/validate", validationRoutes);
app.use("/api/rental", rentalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/seller", sellerRoutes);
app.use("/buyer", buyerRoutes);
app.use("/review", reviewRoutes);
app.use("/api/payfast",paymentRoutes)

// SETUP SOCKET.IO SERVER
const io = setupSocketServer(server);
app.set("io", io); // Make io accessible inside req.app

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

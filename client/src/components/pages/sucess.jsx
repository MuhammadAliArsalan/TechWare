import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const order_id = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const payment_method = "PayFast";
  const payment_status = "successful";
  const payment_date = new Date().toISOString();
  const transaction_id = uuidv4(); // Generate a unique transaction ID

  useEffect(() => {
    const savePaymentToDB = async () => {

      console.log("useEffect triggered");

      if (!order_id || !amount || !transaction_id) {
        console.error("Missing payment info. Cannot save.");
        return;
      }

      try {
        const payload = {
          order_id,
          amount,
          transaction_id,
          payment_method,
          payment_status,
          payment_date,
        };

        const res = await axios.post(
          "http://localhost:3000/api/payfast/savePayment",
          payload,
          { withCredentials: true }
        );

        console.log("Payment saved:", res.data.message);
      } catch (err) {
        console.error("Failed to save payment:", err.response?.data || err.message);
      }
    };

    savePaymentToDB();

    const timer = setTimeout(() => {
      navigate("/");
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigate, order_id, amount, transaction_id, payment_method, payment_status, payment_date]);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      padding: "20px",
      backgroundColor:" #2c3e50"
    }}>
      <h2 style={{
        fontSize: "2.5rem",
        color: "#2e8b57",
        marginBottom: "10px"
      }}>
        🎉 Payment Successful! :<span style={{fontFamily:"monospace"}}> Order ID={order_id} </span>
      </h2>
      <p style={{
        fontSize: "1.2rem",
        color: "whitesmoke",
        marginTop: "0"
      }}>
        Redirecting you back to the homepage in 5 seconds...
      </p>
    </div>
  );
};

export default Success;

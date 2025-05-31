
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const PayFastForm = () => {
  
  const location = useLocation();

  const { email, phone, orderId, transactionAmount, transactionDesc } = location.state || {};

  const [token, setToken] = useState('');
  const [signature, setSignature] = useState('');
  const [formData, setFormData] = useState({
    CURRENCY_CODE: 'PKR',
    MERCHANT_ID: '102',
    MERCHANT_NAME: 'TechWare',
    BASKET_ID: '',
    TXNAMT: '',
    ORDER_DATE: new Date().toISOString(),
    SUCCESS_URL: 'http://localhost:5173/payment/success',
    FAILURE_URL: 'http://localhost:5173/payment/failure',
    CHECKOUT_URL: 'https://merchant-site-example.com',
    EMAIL_ADDRESS: '',
    MOBILE_NO: '',
    VERSION: 'MERCHANT-CART-0.1',
    TXNDESC: '',
    PROCCODE: '00',
    TRAN_TYPE: 'ECOMM_PURCHASE',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Payment details received:', { email, phone, orderId, transactionAmount, transactionDesc });

    if (!email || !phone || !orderId || !transactionAmount || !transactionDesc) {
      setError('Error: Payment details are missing. Please try again.');
      return;
    }
    setError('');
    // Ensure that payment details from state are applied to the formData state
    setFormData((prev) => ({
      ...prev,
      BASKET_ID: orderId,
      TXNAMT: transactionAmount,
      EMAIL_ADDRESS: email,
      MOBILE_NO: phone,
      TXNDESC: transactionDesc,
      SUCCESS_URL: `http://localhost:5173/payment/success?orderId=${orderId}&amount=${transactionAmount}`, //  Add this line
    }));
  }, [email, phone, orderId, transactionAmount, transactionDesc]);

  const getToken = async () => {
    const payload = {
      merchantId: formData.MERCHANT_ID,
      securedKey: 'zWHjBp2AlttNu1sK',
      basketId: formData.BASKET_ID,
      transAmount: formData.TXNAMT,
      currencyCode: formData.CURRENCY_CODE,
    };
  
    try {
      const res = await axios.post(
        'http://localhost:3000/api/payfast/get-token',
        payload,
        { withCredentials: true }  
      );
      setToken(res.data.ACCESS_TOKEN);
      setSignature(res.data.SIGNATURE);
      console.log('response from backend:', res.data);
    } catch (error) {
      console.error('Error:', error);
      
      setError('Error: Failed to generate token. Please try again later.');
    }
    
  };

  return (
    <div style={{backgroundColor:" #2c3e50"}}>
    <div style={{width: '100%',paddingBlock: '20px'}}>
    <div style={{ maxWidth: '550px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 6px 16px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Proceed to Payment</h2>

      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          onClick={getToken}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Generate Token
        </button>
      </div>

      <form method="post" action="https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor={key} style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                {key.replace(/_/g, ' ')}
              </label>
              <input
                type="text"
                name={key}
                id={key}
                value={value}
                readOnly
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}
              />
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="TOKEN" style={{ marginBottom: '5px', fontWeight: 'bold' }}>TOKEN</label>
            <input
              type="text"
              name="TOKEN"
              id="TOKEN"
              value={token}
              readOnly
              style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f1f1f1' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="SIGNATURE" style={{ marginBottom: '5px', fontWeight: 'bold' }}>SIGNATURE</label>
            <input
              type="text"
              name="SIGNATURE"
              id="SIGNATURE"
              value={signature}
              readOnly
              style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f1f1f1' }}
            />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            type="submit"
            disabled={!token}
            style={{
              padding: '12px 30px',
              backgroundColor: token ? '#28a745' : '#aaa',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: token ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Make Payment
          </button>
        </div>
      </form>
    </div>
    </div>
    </div>
  );
};

export default PayFastForm;

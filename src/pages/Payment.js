import "../styles/payment.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Payment = () => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
    amount: 0,
  });

  const [formData, setFormData] = useState(null);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [bookingVerified, setBookingVerified] = useState(false);

  useEffect(() => {
    // Check if booking information is available in local storage
    const storedFormData = JSON.parse(localStorage.getItem("formData"));
    const totalPrice = localStorage.getItem("totalPrice");

    if (storedFormData && totalPrice) {
      setFormData(storedFormData);
      setPaymentData((prevData) => ({
        ...prevData,
        amount: totalPrice,
      }));
      setBookingVerified(true); // Set booking verification flag
    } else {
      // Redirect or handle case where booking data is not found
      handleBookingNotFound();
    }
  }, []);

  const handleBookingNotFound = () => {
    // Redirect to the booking page if booking data is not found
    window.location.href = "/book"; // Replace with your actual booking page route
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/payment", {
        paymentData,
      });
      if (response.status === 200) {
        // Send form data to the server to send the email
        await axios.post("http://localhost:4000/booked", { formData });
        setPaymentSuccessful(true);
        // Optionally clear form data from localStorage or reset it
        localStorage.removeItem("formData");
        localStorage.removeItem("totalPrice");
      } else {
        console.error("Payment failed", response.data);
      }
    } catch (error) {
      console.error("There was an error processing the payment!", error);
    }
  };

  const handleBackToHome = () => {
    // Redirect to the home page
    window.location.href = "/"; // Replace with your actual home page route
  };

  if (!bookingVerified) {
    return (
      <div className="paymentFormBackground">
        <h1>Error: No Booking Found</h1>
        <p>Please complete the booking process to access the payment page.</p>
        <button onClick={handleBackToHome}>Back to Home</button>
      </div>
    );
  }

  if (paymentSuccessful) {
    return (
      <div className="paymentFormBackground">
        <h1>Payment Successful!</h1>
        <p>Your payment has been successfully processed.</p>
        <button onClick={handleBackToHome}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="paymentFormBackground">
      <form className="paymentForm" onSubmit={handleSubmit}>
        <h1>Payment Details</h1>
        <p>Test: {formData.test}</p>
        <p>CSCS Card: {formData.cscsCardType}</p>
        <p>Type of Card: {formData.cardAction}</p>
        <p>Amount: £{paymentData.amount}</p>
        <label>
          Card Number*:
          <input
            type="text"
            name="cardNumber"
            value={paymentData.cardNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Card Holder Name*:
          <input
            type="text"
            name="cardHolderName"
            value={paymentData.cardHolderName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Expiry Date (MM/YY)*:
          <input
            type="text"
            name="expiryDate"
            value={paymentData.expiryDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          CVV*:
          <input
            type="text"
            name="cvv"
            value={paymentData.cvv}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Pay £{paymentData.amount}</button>
      </form>
    </div>
  );
};

export default Payment;

import React from "react";
import "../styles/payment.css"; // Ensure you import your CSS file

const PaymentPage = () => {
  return (
    <div className="paymentFormBackground">
      <div className="paymentForm">
        <h1>Confirm Your Booking Details</h1>
        {/* Your form inputs and elements go here */}
        <form>
          <label className="required">Card details</label>
          {/* Add the CardElement or other Stripe elements here */}
          <div id="card-element">
            {/* Stripe.js will inject the CardElement here */}
          </div>
          <button type="submit">Pay Now</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;

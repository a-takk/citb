import React from "react";
import "../styles/success.css";
import { Helmet } from "react-helmet-async";

const Success = () => {
  return (
    <div className="successFormBackground">
      <Helmet>
        <title>Checkout Success | CITB Certify</title>
      </Helmet>
      <div className="successForm">
        <h1>Thank you for booking</h1>
        <h2>A confirmation has been sent to your email</h2>

        <a href="/" class="button">
          Home
        </a>
      </div>
    </div>
  );
};

export default Success;

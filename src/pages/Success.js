import React from "react";
import "../styles/success.css"; // Ensure you import your CSS file

const Success = () => {
  return (
    <div className="successFormBackground">
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

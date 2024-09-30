import React from "react";
import "../styles/failed.css";

const Failed = () => {
  return (
    <div className="failedBackground">
      <Helmet>
        <title>Checkout Failure | CITB Certify</title>
      </Helmet>
      <div className="failed">
        <h1>Payment has failed</h1>
        <h2>Please click the button below to rebook your test</h2>

        <a href="/" className="button">
          Book
        </a>
      </div>
    </div>
  );
};

export default Failed;

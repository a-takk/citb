import React from "react";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About Us</h4>
          <p>
            We are committed to providing the best service possible. Contact us
            for more information.
          </p>
        </div>
        <div className="footer-section">
          <h4>Contact Information</h4>
          <p>77 Bilhay St, West Bromwich, B70 9RD</p>
          <p>07584857465</p>
          <p>info@example.com</p>
        </div>
        <div className="footer-section">
          <h4>Privacy and Terms</h4>
          <ul className="social-links">
            <li>
              <a href="/termsandconditions">Terms and Conditions</a>
            </li>
            <li>
              <a href="/privacypolicy">Privacy Policy</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© CITB Certify. All rights reserved.</p>
      </div>
    </footer>
  );
}

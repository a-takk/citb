import React, { useState, useEffect } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navcontainer">
          <a className="navlogo" href="/">
            CITB Certify
          </a>
          <div className="hamburger" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
          <div className={`formbuttons ${isMenuOpen ? "active" : ""}`}>
            <a className="button" href="/cards">
              Cards
            </a>
            <a className="button" href="/book">
              Book
            </a>
            <a className="button" href="/contactus">
              Contact Us
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

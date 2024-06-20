import React, { useState } from "react";
import "../styles/contact.css";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/booked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });

      if (response.ok) {
        alert("Email sent successfully!");
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        alert("Error sending email.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending email.");
    }
  };

  return (
    <div className="contactbackground">
      <div className="contactcontainer">
        <h1 className="contactformheading">Contact Us</h1>
        <form className="contactform" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            className="contactinput"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            className="contactinput"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button className="contactbutton" type="submit">
            Submit
          </button>
        </form>

        <div className="contactdetails">
          <div className="column">
            <h1>Address:</h1>
            <p>
              123 Main Street
              <br />
              Springfield, USA
              <br />
              ZIP Code: 12345
            </p>
          </div>
          <div className="column">
            <h1>Phone:</h1>
            <p>07594857847</p>
          </div>
          <div className="column">
            <h1>Email:</h1>
            <p>info@example.com</p>
          </div>
        </div>

        <div className="contactlocation">
          <h1 className="contactlocationheading">Where are we located?</h1>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77669.66003879122!2d-2.1504174299291776!3d52.53023390122326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870978802d5650b%3A0x5da3785b1d85460f!2sWest%20Bromwich!5e0!3m2!1sen!2suk!4v1717939137085!5m2!1sen!2suk"
              className="map"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;

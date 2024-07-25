import React, { useState } from "react";
import "../styles/contact.css";

function ContactUs() {
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://citbcertify-20840f8ccc0e.herokuapp.com/api/email-sent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: contactFormData.email,
            formData: contactFormData, // Ensure formData contains all contact form data
          }),
        }
      );

      if (response.ok) {
        alert("Email sent successfully!");
        setContactFormData({
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
      <form onSubmit={handleSubmit}>
        <h1 className="contactformheading">Contact Us</h1>
        <label htmlFor="name" className="label">
          Name:
        </label>
        <input
          className="contactinput"
          type="text"
          id="name"
          name="name"
          value={contactFormData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email" className="label">
          Email:
        </label>
        <input
          className="contactinput"
          type="email"
          id="email"
          name="email"
          value={contactFormData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="message" className="label">
          Message:
        </label>
        <textarea
          id="message"
          name="message"
          rows="4"
          value={contactFormData.message}
          onChange={handleChange}
          required
        ></textarea>

        <button className="contactbutton" type="submit">
          Submit
        </button>

        <div className="contactdetails">
          <div className="column">
            <h1>Address:</h1>
            <p>
              77 Bilhay St
              <br />
              West Bromwich
              <br />
              B70 9RD
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

        <div className="contactlocationcontainer">
          <h1 className="contactlocationheading">Where are we located?</h1>
          <div className="contactlocation">
            <iframe
              title="Google Maps Location for West Bromwich"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77669.66003879122!2d-2.1504174299291776!3d52.53023390122326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870978802d5650b%3A0x5da3785b1d85460f!2sWest%20Bromwich!5e0!3m2!1sen!2suk!4v1717939137085!5m2!1sen!2suk"
              width="100%"
              height="100%"
              id="contactlocation"
              style={{
                border: "0",
                width: "80%",
                height: "450px",
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ContactUs;

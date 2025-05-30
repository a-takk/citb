import React, { useState } from "react";
import "../styles/contact.css";
import { Helmet } from "react-helmet-async";

function ContactUs() {
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [alertMessage, setAlertMessage] = useState(""); // State to store alert message
  const [showAlert, setShowAlert] = useState(false); // State to control visibility of alert

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
        "https://www.citbcertify.co.uk/api/email-sent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: contactFormData.email,
            formData: contactFormData,
          }),
        }
      );

      if (response.ok) {
        setAlertMessage("Email sent successfully!");
        setShowAlert(true);
        setContactFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        setAlertMessage("Error sending email. Please try again later.");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Error sending email. Please try again later. ");
      setShowAlert(true);
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 10000);
  };

  return (
    <div className="contactbackground">
      <Helmet>
        <title>Contact Us | CITB Certify</title>
        <meta
          name="description"
          content="Have any questions? Fill out this form and ask us any questions you have! Relevant information regarding our business is also listed on the page."
        />
      </Helmet>
      <form onSubmit={handleSubmit} className="form">
        <h1 className="contactformheading">Contact Us</h1>
        {showAlert && <p className="alert-message">{alertMessage}</p>}
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
            <p>07493980923</p>
          </div>
          <div className="column">
            <h1>Email:</h1>
            <p>citbcertify@gmail.com</p>
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

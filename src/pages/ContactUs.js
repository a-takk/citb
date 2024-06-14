import React from "react";
import "../styles/style.css";

function ContactUs() {
  return (
    <div className="contactbackground">
      <div className="contactcontainer">
        <h1 className="contactformheading">Contact Us</h1>
        <form className="contactform" action="/submit" method="POST">
          <label htmlFor="name">Name</label>
          <input
            className="contactinput"
            type="text"
            id="name"
            name="name"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            className="contactinput"
            type="email"
            id="email"
            name="email"
            required
          />

          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="4" required></textarea>

          <button className="contactbutton" type="submit">
            Submit
          </button>
        </form>

        <div class="contactcontainer">
          <div class="contactdetails">
            <div class="column">
              <p>
                <h1>Address:</h1>
              </p>
              <p>
                123 Main Street
                <br />
                Springfield, USA
                <br />
                ZIP Code: 12345
              </p>
            </div>
            <div class="column">
              <p>
                <h1>Phone:</h1> 07594857847
              </p>
            </div>
            <div class="column">
              <p>
                <h1>Email:</h1> info@example.com
              </p>
            </div>
          </div>
        </div>
        <div className="contactlocation">
          <h1 className="contactlocationheading">Where are we located?</h1>
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77669.66003879122!2d-2.1504174299291776!3d52.53023390122326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870978802d5650b%3A0x5da3785b1d85460f!2sWest%20Bromwich!5e0!3m2!1sen!2suk!4v1717939137085!5m2!1sen!2suk"
              width="100%"
              height="100%"
              style={{ border: 0, height: 400, width: 750 }}
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

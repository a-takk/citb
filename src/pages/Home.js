import "../styles/home.css";
import cscs from "../images/green-labourer-cscs-card.webp";
import booking from "../images/booking.gif";
import { useRef } from "react";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const targetRef = useRef(null);

  const handleScroll = () => {
    targetRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="herocontainer">
        <Helmet>
          <title>Home | CITB Certify</title>
          <meta
            name="description"
            content="Welcome to CITB Certify, your go-to platform for booking CITB tests and obtaining CSCS cards. Explore our easy-to-use service to schedule your test, find the right CSCS card, and learn more about our location."
          />
        </Helmet>
        <div className="herodiv">
          <h1 className="heroheading">Welcome to CITB Certify</h1>
          <p className="herotext">
            Making it simple to book and carry out your CITB Test.
          </p>
          <button className="herobutton" onClick={handleScroll}>
            Scroll Down
          </button>
        </div>
      </div>
      <div className="introcontainer">
        <div className="introdiv1">
          <img src={cscs} className="introimage" alt="introimage" />
        </div>
        <div className="introdiv2" ref={targetRef}>
          <h1 className="introheading">Cards</h1>
          <p className="introtext">
            You can access all the current CSCS cards that you can obtain with
            us, if you are looking to move up and earn a new qualification then
            please go to the booking page in order to book for a test, either
            for a card or a test.
          </p>
          <a className="button" href="/cards">
            Cards
          </a>
        </div>
      </div>
      <div className="bookingcontainer">
        <div className="bookingdiv1">
          <h1 className="bookingheading">Booking</h1>
          <p className="bookingtext">
            Once you have figured out exactly what test or card you need, please
            click on the link to head to the booking page, you will be able to
            fill out a form to pick which CSCS card or test you need, you must
            fill out all the details so we know exactly who you are and what you
            want.
          </p>
          <a className="button" href="/book">
            Book
          </a>
        </div>
        <div className="bookingdiv2">
          <img src={booking} className="bookingimage" alt="bookingimage" />
        </div>
      </div>
      <div className="locationcontainer">
        <h1 className="locationheading">Where are we located?</h1>
        <div className="location">
          <iframe
            title="Google Maps Location for West Bromwich"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77669.66003879122!2d-2.1504174299291776!3d52.53023390122326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870978802d5650b%3A0x5da3785b1d85460f!2sWest%20Bromwich!5e0!3m2!1sen!2suk!4v1717939137085!5m2!1sen!2suk"
            width="100%"
            height="100%"
            style={{
              border: "0",
              width: "70%",
              height: "450px",
            }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </>
  );
}

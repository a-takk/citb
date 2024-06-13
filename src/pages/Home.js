import "../styles/style.css";
import citb from "../images/citb.jpeg";
import marketplace from "../images/marketplace.gif";

export default function Home() {
  return (
    <>
      <div className="herocontainer">
        <div className="herodiv1">
          <h1 className="heroheading">Welcome to CITB Certify</h1>
          <p className="herotext">Where you can book for your CITB test.</p>
          <a className="button" href="#introcontainer">
            Scroll Down
          </a>
        </div>
        <div className="herodiv2">
          <img src={citb} className="heroimage" alt="citb" />
        </div>
      </div>
      <div id="introcontainer" className="introcontainer">
        <div>
          <h1 className="introheading">What do you need first?</h1>
          <p className="introtext">
            First you will need to book for a Health and Safety test, this is
            the way you can qualify for a CSCS card, once you have completed the
            test, then you will be able to obtain a CSCS card or when you are
            going to renew your CSCS card, the price of a Health and Safety test
            is £22.50.
          </p>
          <div className="introdiv">
            <h1 className="introheading2">How does this work?</h1>
            <p className="introtext">
              Upon signing up, navigate to the profile section to change your
              experience to whichever one suits you, only essential information
              will be displayed on the marketplace, your username, an image if
              you want to upload one, as well as the experience you have within
              coding. If you don't want your account to be displayed you can
              also change this.
            </p>
          </div>
        </div>
      </div>
      <div className="marketcontainer">
        <div className="marketdiv1">
          <img src={marketplace} className="marketimage" alt="marketimage" />
        </div>
        <div className="marketdiv2">
          <h1 className="marketheading">Buddies</h1>
          <p className="markettext">
            The Buddies page is here to find your coding buddy, you are able to
            see all available users that are on the buddies page if they choose
            to display their profile, and send a friend request to them, so you
            can chat with them! Click on the button below to access buddies!
          </p>
          <a className="button" href="/marketplace">
            Buddies
          </a>
        </div>
      </div>
      <div className="locationcontainer">
        <h1 className="locationheading">Where are we located?</h1>
        <div className="location">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77669.66003879122!2d-2.1504174299291776!3d52.53023390122326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870978802d5650b%3A0x5da3785b1d85460f!2sWest%20Bromwich!5e0!3m2!1sen!2suk!4v1717939137085!5m2!1sen!2suk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </>
  );
}

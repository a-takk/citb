import "../styles/navbar.css";

export default function Navbar() {
  return (
    <>
      <nav className="navbar">
        <div className="navcontainer">
          <a className="navlogo" href="/">
            CITB Certify
          </a>
          <div className="formbuttons">
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

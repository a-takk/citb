import Home from "./pages/Home";
import Navbar from "./components/navbar";
import Cards from "./pages/Cards";
import Book from "./pages/Book";
import ContactUs from "./pages/ContactUs";
import Success from "./pages/Success";
import Failed from "./pages/Failed";
import Footer from "./components/footer";
import Admin from "./pages/Admin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

function App() {
  let component;
  switch (window.location.pathname) {
    case "/":
      component = <Home />;
      break;
    case "/cards":
      component = <Cards />;
      break;
    case "/book":
      component = <Book />;
      break;
    case "/success":
      component = <Success />;
      break;
    case "/failure":
      component = <Failed />;
      break;
    case "/admin":
      component = <Admin />;
      break;
    case "/contactus":
      component = <ContactUs />;
      break;
    case "/privacypolicy":
      component = <PrivacyPolicy />;
      break;
    case "/termsandconditions":
      component = <TermsOfService />;
      break;
    default:
  }
  return (
    <div>
      <Navbar />
      {component}
      <Footer />
    </div>
  );
}

export default App;

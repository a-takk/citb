import Home from "./pages/Home";
import Navbar from "./components/navbar";
import Cards from "./pages/Cards";
import Book from "./pages/Book";
import ContactUs from "./pages/ContactUs";
import Success from "./pages/Success";
import Failed from "./pages/Failed";
import Admin from "./pages/Admin";

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
  }
  return (
    <div>
      <Navbar />
      {component}
    </div>
  );
}

export default App;

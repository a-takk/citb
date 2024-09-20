import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; // Import HelmetProvider

import Home from "./pages/Home";
import Navbar from "./components/navbar";
import Cards from "./pages/Cards";
import BookCSCS from "./pages/BookCSCS";
import BookCITB from "./pages/BookCITB";
import ContactUs from "./pages/ContactUs";
import Success from "./pages/Success";
import Failed from "./pages/Failed";
import Footer from "./components/footer";
import Admin from "./pages/Admin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Login from "./pages/Login";
import RequireAuth from "./components/requireauth";
import { AuthProvider } from "./components/authcontext";

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        {" "}
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/book-cscs" element={<BookCSCS />} />
            <Route path="/book-citb" element={<BookCITB />} />
            <Route path="/success" element={<Success />} />
            <Route path="/failure" element={<Failed />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/termsandconditions" element={<TermsOfService />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <Admin />
                </RequireAuth>
              }
            />
          </Routes>
          <Footer />
        </Router>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;

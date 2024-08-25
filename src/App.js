import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; // Import HelmetProvider

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
import Login from "./pages/Login";
import RequireAuth from "./components/requireauth";
import { AuthProvider } from "./components/authcontext";

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        {" "}
        {/* Wrap everything with HelmetProvider */}
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/book" element={<Book />} />
            <Route path="/success" element={<Success />} />
            <Route path="/failure" element={<Failed />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/termsandconditions" element={<TermsOfService />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Route */}
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

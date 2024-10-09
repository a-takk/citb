import "../styles/book.css";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Helmet } from "react-helmet";

const stripePromise = loadStripe(
  "pk_test_51PmkECHgNlkUn5WHbS3z34qm8yRlRh1G6Gl78Nguktmu7gNe8umkn7st8rtDr25YtUPbX2DaNA5OHSLuSZRRVfiq00g5bfPz0p"
);

const BookCITB = () => {
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    surname: "",
    dateOfBirthDay: "",
    dateOfBirthMonth: "",
    dateOfBirthYear: "",
    gender: "",
    postcode: "",
    address: "",
    town: "",
    county: "",
    country: "United Kingdom",
    mobileNumber: "",
    email: "",
    confirmEmail: "",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stripe = await stripePromise;
    const selectedTest = formData.test;
    const price = 30;

    try {
      const response = await fetch(
        "https://www.citbcertify.co.uk/api/create-checkout-session-citb",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ test: selectedTest, price, formData }),
        }
      );

      const textResponse = await response.text();
      console.log("Server Response:", textResponse);

      const session = JSON.parse(textResponse);

      if (!session.sessionId) {
        throw new Error("Session ID is not returned from server");
      }

      localStorage.setItem("bookingFormData", JSON.stringify(formData));

      const { error } = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });
      if (error) {
        console.error("Stripe Checkout error:", error);
      }

      const data = await response.json();
      if (data.success) {
        alert("CITB Test booked successfully!");
      } else {
        alert("There was an issue booking your test. Please try again.");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error.message);
      setAlertMessage("Failed to start payment. Please try again later.");
      setShowAlert(true);
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 10000);
  };

  const handleDateOfBirthChange = (e) => {
    const { name, value } = e.target;
    const currentYear = new Date().getFullYear();
    let newValue = value.replace(/\D/g, "");

    if (name === "dateOfBirthDay") {
      if (parseInt(newValue) > 31) {
        newValue = "31";
      }
    } else if (name === "dateOfBirthMonth") {
      if (parseInt(newValue) > 12) {
        newValue = "12";
      }
    } else if (name === "dateOfBirthYear") {
      if (parseInt(newValue) > currentYear) {
        newValue = String(currentYear);
      }
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  return (
    <div className="formbackground">
      <Helmet>
        <title>Book your CITB Test | CITB Certify</title>
        <meta
          name="description"
          content="Book your basic Health and Safety test required for the CSCS card qualification. Complete the CITB test to ensure safety on construction sites."
        />
      </Helmet>

      <form onSubmit={handleSubmit}>
        <h1>Start your CITB Booking</h1>
        {showAlert && <p className="alert-message">{alertMessage}</p>}
        <h2>Personal Details</h2>
        <label>
          Title:
          <select name="title" onChange={handleChange} value={formData.title}>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
            <option value="Miss">Miss</option>
            <option value="Dr">Dr</option>
          </select>
        </label>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            onChange={handleChange}
            value={formData.firstName}
          />
        </label>
        <label>
          Surname:
          <input
            type="text"
            name="surname"
            onChange={handleChange}
            value={formData.surname}
          />
        </label>
        <label>
          Date of Birth:
          <div>
            <input
              type="text"
              name="dateOfBirthDay"
              placeholder="DD"
              value={formData.dateOfBirthDay}
              onChange={handleDateOfBirthChange}
              required
              maxLength={2}
            />
            <input
              type="text"
              name="dateOfBirthMonth"
              placeholder="MM"
              value={formData.dateOfBirthMonth}
              onChange={handleDateOfBirthChange}
              required
              maxLength={2}
            />
            <input
              type="text"
              name="dateOfBirthYear"
              placeholder="YYYY"
              value={formData.dateOfBirthYear}
              onChange={handleDateOfBirthChange}
              required
              maxLength={4}
            />
          </div>
        </label>
        <label>
          Gender:
          <select name="gender" onChange={handleChange} value={formData.gender}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </label>

        <h2>Address Details</h2>
        <label>
          Postcode:
          <input
            type="text"
            name="postcode"
            onChange={handleChange}
            value={formData.postcode}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            onChange={handleChange}
            value={formData.address}
          />
        </label>
        <label>
          Town/City:
          <input
            type="text"
            name="town"
            onChange={handleChange}
            value={formData.town}
          />
        </label>
        <label>
          County:
          <input
            type="text"
            name="county"
            onChange={handleChange}
            value={formData.county}
          />
        </label>
        <label>
          Country:
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            readOnly
          />
        </label>

        <h2>Contact Details</h2>
        <label>
          Mobile Number:
          <input
            type="text"
            name="mobileNumber"
            placeholder="07(XXX)XXX-XXX"
            onChange={handleChange}
            value={formData.mobileNumber}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
          />
        </label>
        <label>
          Confirm Email:
          <input
            type="email"
            name="confirmEmail"
            onChange={handleChange}
            value={formData.confirmEmail}
          />
        </label>
        <label>
          <input type="checkbox" name="agree" />I agree to the terms and
          conditions.
        </label>
        <button type="submit">Checkout</button>
      </form>
    </div>
  );
};

export default BookCITB;

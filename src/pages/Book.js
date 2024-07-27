import "../styles/book.css"; // Import CSS for styling
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe("pk_test_AqC7rHZn75dF9mR6ND8i5OI6");

const Book = () => {
  // Helper function to get the current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // State for available slots, prices, and form data
  const [availableSlots, setAvailableSlots] = useState([]);
  const [prices, setPrices] = useState({});
  const [formData, setFormData] = useState({
    cscsCardType: "",
    cardAction: "",
    title: "Mr",
    firstName: "",
    surname: "",
    dateOfBirthDay: "",
    dateOfBirthMonth: "",
    dateOfBirthYear: "",
    gender: "Male",
    test: "",
    testLanguage: "",
    testDate: getCurrentDate(),
    testTime: "",
    address: "",
    town: "",
    county: "",
    country: "United Kingdom",
    postcode: "",
    mobileNumber: "",
    email: "",
    confirmEmail: "",
    agree: false,
  });

  useEffect(() => {
    if (formData.testDate) {
      fetchAvailableSlots(formData.testDate);
    }
  }, [formData.testDate]);

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await fetch(
        `https://www.citbcertify.co.uk/api/available-slots?date=${date}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Response Content-Type:",
        response.headers.get("Content-Type")
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (response.headers.get("Content-Type")?.includes("application/json")) {
        const responseData = await response.json();
        console.log("Available slots fetched:", responseData);
        setAvailableSlots(
          responseData.map((slot) => ({
            time: slot.testTime.substring(0, 5), // Format time to HH:MM
          }))
        );
      } else {
        const responseText = await response.text();
        console.error(
          "Unexpected response format. Response text:",
          responseText
        );
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://www.citbcertify.co.uk/api/cscs-test-prices"
        );

        if (
          response.ok &&
          response.headers.get("Content-Type")?.includes("application/json")
        ) {
          const data = await response.json();
          console.log("Prices fetched:", data);
          if (Array.isArray(data)) {
            const priceMap = data.reduce((acc, item) => {
              if (item && item.testName && item.price !== undefined) {
                acc[item.testName] = item.price;
              }
              return acc;
            }, {});
            setPrices(priceMap);
          } else {
            console.error("Unexpected data format for prices:", data);
          }
        } else {
          const responseText = await response.text();
          console.error(
            "Unexpected response format. Response text:",
            responseText
          );
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      testDate: value,
      testTime: "",
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const stripe = await stripePromise;
    const selectedTest = formData.test;
    const price = prices[selectedTest];

    try {
      const response = await fetch(
        "https://www.citbcertify.co.uk/api/create-checkout-session",
        {
          method: "POST",
          body: JSON.stringify({ test: selectedTest, price, formData }),
        }
      );

      const session = await response.json();

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
    } catch (error) {
      console.error("Error creating checkout session:", error.message);
      alert("Failed to start payment. Please try again later.");
    }
  };

  return (
    <div className="formbackground">
      <form onSubmit={handleSubmit} className="form">
        <h1>Start your booking</h1>
        <h2>Your CSCS Card</h2>
        <label>
          What CSCS Card do you need?:
          <select
            name="cscsCardType"
            value={formData.cscsCardType}
            onChange={handleChange}
          >
            <option value="" disabled>
              Please select...
            </option>
            <option value="Green Labourer CSCS Card">
              Green Labourer CSCS Card
            </option>
            <option value="Blue Skilled CSCS Card">
              Blue Skilled CSCS Card
            </option>
            <option value="Gold Advanced CSCS Card">
              Gold Advanced CSCS Card
            </option>
            <option value="Red Provisional CSCS Card">
              Red Provisional CSCS Card
            </option>
            <option value="Gold CSCS Card">Gold CSCS Card</option>
            <option value="Black CSCS Card">Black CSCS Card</option>
            <option value="White AQP CSCS Card">White AQP CSCS Card</option>
            <option value="White PQP CSCS Card">White PQP CSCS Card</option>
          </select>
        </label>
        <label>
          <input
            type="radio"
            name="cardAction"
            value="New CSCS Card"
            checked={formData.cardAction === "New CSCS Card"}
            onChange={handleChange}
          />
          New CSCS Card (I do not have a CSCS Card)
        </label>
        <label>
          <input
            type="radio"
            name="cardAction"
            value="Renewal of CSCS Card"
            checked={formData.cardAction === "Renewal of CSCS Card"}
            onChange={handleChange}
          />
          Renewal of CSCS Card (My CSCS Card has expired)
        </label>
        <h2>Who's Taking The Test</h2>
        <label>
          Title:
          <select name="title" value={formData.title} onChange={handleChange}>
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
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Surname:
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Date of Birth:
          <div>
            <input
              type="text"
              name="dateOfBirthDay"
              value={formData.dateOfBirthDay}
              onChange={handleChange}
              placeholder="DD"
              maxLength="2"
              required
            />
            <input
              type="text"
              name="dateOfBirthMonth"
              value={formData.dateOfBirthMonth}
              onChange={handleChange}
              placeholder="MM"
              maxLength="2"
              required
            />
            <input
              type="text"
              name="dateOfBirthYear"
              value={formData.dateOfBirthYear}
              onChange={handleChange}
              placeholder="YYYY"
              maxLength="4"
              required
            />
          </div>
        </label>
        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </label>
        <h2>Select Your Test</h2>
        <label>
          Test:
          <select name="test" value={formData.test} onChange={handleChange}>
            <option value="" disabled>
              Please select...
            </option>
            {Object.keys(prices).map((key) => (
              <option key={key} value={key}>
                {`${key} (£${prices[key]})`}
              </option>
            ))}
          </select>
        </label>
        <label>
          Language:
          <select
            name="testLanguage"
            value={formData.testLanguage}
            onChange={handleChange}
          >
            <option value="" disabled>
              Please select...
            </option>
            <option value="English">English</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Italian">Italian</option>
          </select>
        </label>
        <label>
          Date:
          <input
            type="date"
            name="testDate"
            className="date"
            value={formData.testDate}
            onChange={handleDateChange}
            min={getCurrentDate()}
            required
          />
        </label>
        <label>
          Time:
          <select
            name="testTime"
            value={formData.testTime}
            onChange={handleChange}
          >
            <option value="" disabled>
              Please select...
            </option>
            {availableSlots.map((slot) => (
              <option key={slot.time} value={slot.time}>
                {slot.time}
              </option>
            ))}
          </select>
        </label>
        <h2>Address Details</h2>
        <label>
          Postcode:
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Town/City:
          <input
            type="text"
            name="town"
            value={formData.town}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          County:
          <input
            type="text"
            name="county"
            value={formData.county}
            onChange={handleChange}
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
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Confirm Email:
          <input
            type="email"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
          />
          I agree to the terms and conditions, with acknowledgement of this
          booking is for the CITB Health, Safety & Environment Test, as a
          requirement for CSCS card eligibility.
        </label>
        <button type="submit">Checkout</button>
      </form>
    </div>
  );
};

export default Book;

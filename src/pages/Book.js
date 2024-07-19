import "../styles/book.css"; // Import CSS for styling
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

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
      // Fetching data from the backend API
      const response = await axios.get(
        `https://citbcertify-20840f8ccc0e.herokuapp.com/api/available-slots?date=${date}`
      );

      // Check if the response is OK (status code 200-299)
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = response.data;
      console.log("Available slots fetched:", responseData);
      setAvailableSlots(
        responseData.map((slot) => ({
          time: slot.testTime.substring(0, 5), // Format time to HH:MM
        }))
      );
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(
          "https://citbcertify-20840f8ccc0e.herokuapp.com/api/cscs-test-prices"
        );

        if (
          response.status === 200 &&
          response.headers["content-type"]?.includes("application/json")
        ) {
          const data = response.data;
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
          console.error(
            `Expected JSON but got ${response.headers["content-type"]}. Response: ${response.data}`
          );
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle date changes
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
      const response = await axios.post(
        "https://citbcertify-20840f8ccc0e.herokuapp.com/api/create-checkout-session",
        {
          test: selectedTest,
          price,
          formData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const session = response.data;

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
          </select>
        </label>

        <label>
          Action required:
          <select
            name="cardAction"
            value={formData.cardAction}
            onChange={handleChange}
          >
            <option value="" disabled>
              Please select...
            </option>
            <option value="Applying for new CSCS Card">
              Applying for new CSCS Card
            </option>
            <option value="Renewing my CSCS Card">Renewing my CSCS Card</option>
            <option value="Reapplying for my CSCS Card">
              Reapplying for my CSCS Card
            </option>
            <option value="Replacing my CSCS Card">
              Replacing my CSCS Card
            </option>
          </select>
        </label>

        <h2>About you</h2>
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

        <label>Date of Birth:</label>
        <div className="date-of-birth">
          <select
            name="dateOfBirthDay"
            value={formData.dateOfBirthDay}
            onChange={handleChange}
            required
          >
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={String(day).padStart(2, "0")}>
                {day}
              </option>
            ))}
          </select>
          <select
            name="dateOfBirthMonth"
            value={formData.dateOfBirthMonth}
            onChange={handleChange}
            required
          >
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={String(month).padStart(2, "0")}>
                {month}
              </option>
            ))}
          </select>
          <select
            name="dateOfBirthYear"
            value={formData.dateOfBirthYear}
            onChange={handleChange}
            required
          >
            <option value="">Year</option>
            {Array.from(
              { length: 100 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <h2>Your Test</h2>
        <label>
          Which CSCS test do you need to book?:
          <select name="test" value={formData.test} onChange={handleChange}>
            <option value="" disabled>
              Please select...
            </option>
            <option value="Operatives">Operatives</option>
            <option value="Specialist">Specialist</option>
            <option value="Managers and Professionals">
              Managers and Professionals
            </option>
          </select>
        </label>

        <label>
          Select a language for your test:
          <select
            name="testLanguage"
            value={formData.testLanguage}
            onChange={handleChange}
          >
            <option value="English">English</option>
            <option value="Welsh">Welsh</option>
          </select>
        </label>

        <label>
          Select a test date:
          <input
            type="date"
            name="testDate"
            value={formData.testDate}
            onChange={handleDateChange}
            required
            min={getCurrentDate()}
          />
        </label>

        <label>
          Select a test time:
          <select
            name="testTime"
            value={formData.testTime}
            onChange={handleChange}
            required
          >
            <option value="">Please select...</option>
            {availableSlots.map((slot, index) => (
              <option key={index} value={slot.time}>
                {slot.time}
              </option>
            ))}
          </select>
        </label>

        <h2>Contact Information</h2>
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
          Town:
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
            required
          />
        </label>
        <label>
          Postcode:
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Mobile Number:
          <input
            type="tel"
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
            required
          />
          I agree to the terms and conditions
        </label>

        <button type="submit">Proceed to Payment</button>
      </form>
    </div>
  );
};

export default Book;

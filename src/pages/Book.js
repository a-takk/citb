import "../styles/book.css";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Book = () => {
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

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
      const response = await axios.get(
        `https://citbcertify-20840f8ccc0e.herokuapp.com/api/available-slots?date=${date}`
      );
      setAvailableSlots(
        response.data.map((slot) => ({
          time: slot.testTime.substring(0, 5),
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
        const priceMap = response.data.reduce((acc, item) => {
          if (item?.testName && item.price !== undefined) {
            acc[item.testName] = item.price;
          }
          return acc;
        }, {});
        setPrices(priceMap);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      testDate: value,
      testTime: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stripe = await stripePromise;
    const selectedTest = formData.test;
    const price = prices[selectedTest];

    try {
      const response = await axios.post(
        "https://citbcertify-20840f8ccc0e.herokuapp.com/api/create-checkout-session",
        { test: selectedTest, price, formData }
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
          <input
            type="number"
            name="dateOfBirthDay"
            value={formData.dateOfBirthDay}
            onChange={handleChange}
            placeholder="Day"
            required
          />
          <input
            type="number"
            name="dateOfBirthMonth"
            value={formData.dateOfBirthMonth}
            onChange={handleChange}
            placeholder="Month"
            required
          />
          <input
            type="number"
            name="dateOfBirthYear"
            value={formData.dateOfBirthYear}
            onChange={handleChange}
            placeholder="Year"
            required
          />
        </label>
        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label>
          Select your test:
          <select name="test" value={formData.test} onChange={handleChange}>
            <option value="" disabled>
              Please select...
            </option>
            <option value="Health, Safety and Environment Test for Operatives">
              Health, Safety and Environment Test for Operatives
            </option>
            <option value="Health, Safety and Environment Test for Specialists">
              Health, Safety and Environment Test for Specialists
            </option>
            <option value="Health, Safety and Environment Test for Managers and Professionals">
              Health, Safety and Environment Test for Managers and Professionals
            </option>
          </select>
        </label>
        <label>
          Select your preferred language:
          <select
            name="testLanguage"
            value={formData.testLanguage}
            onChange={handleChange}
          >
            <option value="" disabled>
              Please select...
            </option>
            <option value="English">English</option>
            <option value="Welsh">Welsh</option>
          </select>
        </label>
        <label>
          Select test date:
          <input
            type="date"
            name="testDate"
            value={formData.testDate}
            onChange={handleDateChange}
            min={getCurrentDate()}
            required
          />
        </label>
        <label>
          Select test time:
          <select
            name="testTime"
            value={formData.testTime}
            onChange={handleChange}
            required
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
        <h2>Address</h2>
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Book;

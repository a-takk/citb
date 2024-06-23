import "../styles/book.css"; // Import CSS for styling
import React, { useState } from "react";

const Book = () => {
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const prices = {
    "Green Labour er CSCS Card": 30,
    "Blue Skilled CSCS Card": 50,
    "Gold Advanced CSCS Card": 70,
    "Red Provisional CSCS Card": 40,
    "Gold CSCS Card": 90,
    "Black CSCS Card": 100,
    "White AQP CSCS Card": 110,
    "White PQP CSCS Card": 120,
    "New CSCS Card": 20,
    "Renewal of CSCS Card": 15,
    "Managers & Professionals Test (MAP)": 50,
    "Supervisors Test (SPEC-SUP)": 50,
    "Plumbing or Gas Test (SPEC-PLUM)": 50,
    "Working at Heights Test (SPEC-WAH)": 50,
    "Highway Works Test (SPEC-HIW)": 50,
    "Demolition Test (SPEC-DEM)": 50,
    "Domestic Heating and Plumbing HVACR Test (SPEC-HAPS)": 50,
    "Ductwork HVACR Test (SPEC-DUCT)": 50,
    "Pipefitting and Welding HVACR Test (SPEC-PFW)": 50,
    "Refrigeration and Air Conditioning HVACR Test (SPEC-RAAC)": 50,
    "Services and Facilities HVACR Test (SPEC-SAF)": 50,
    "Lift and Escalators Test (SPEC-LAEE)": 50,
    "Tunnelling Test (SPEC-TUNN)": 50,
  };

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
    testTime: "Any",
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/booked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });

      if (response.ok) {
        // Store form data in local storage
        localStorage.setItem("bookingFormData", JSON.stringify(formData));

        // Redirect to payment page
        window.location.href = "/payment";
      } else {
        throw new Error("Failed to submit booking.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      // Handle error (e.g., show user a message)
      alert("Failed to submit booking. Please try again later.");
    }
  };

  return (
    <div className="formbackground">
      <form onSubmit={handleSubmit}>
        <h1>Start your booking</h1>
        <h2>Your CSCS Card</h2>
        <label>
          What CSCS Card do you need?:
          <select
            name="cscsCardType"
            value={formData.cscsCardType}
            onChange={handleChange}
          >
            <option value="">Please select...</option>
            <option value="" disabled selected>
              Operatives/Specialists
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
            <option value="" disabled selected>
              Managers/Supervisors
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
          First Name*:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Surname*:
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Date of Birth *:
          <div>
            <input
              type="text"
              name="dateOfBirthDay"
              value={formData.dateOfBirthDay}
              onChange={handleChange}
              placeholder="Day"
              required
            />
            <input
              type="text"
              name="dateOfBirthMonth"
              value={formData.dateOfBirthMonth}
              onChange={handleChange}
              placeholder="Month"
              required
            />
            <input
              type="text"
              name="dateOfBirthYear"
              value={formData.dateOfBirthYear}
              onChange={handleChange}
              placeholder="Year"
              required
            />
          </div>
        </label>
        <label>
          Gender*:
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <h2>Test Type, Date & Location</h2>
        <label>
          Test*:
          <select
            name="test"
            value={formData.test}
            onChange={handleChange}
            required
          >
            <option value="">Please select...</option>
            <option value="" disabled selected>
              Operatives
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
            <option value="" disabled selected>
              Managers/Supervisors
            </option>
            <option value="Managers & Professionals Test (MAP)">
              Managers & Professionals Test (MAP)
            </option>
            <option value="Supervisors Test (SPEC-SUP)">
              Supervisors Test (SPEC-SUP)
            </option>
            <option value="" disabled selected>
              Specialists
            </option>
            <option value="Plumbing or Gas Test (SPEC-PLUM)">
              Plumbing or Gas Test (SPEC-PLUM)
            </option>
            <option value="Working at Heights Test (SPEC-WAH)">
              Working at Heights Test (SPEC-WAH)
            </option>
            <option value="Highway Works Test (SPEC-HIW)">
              Highway Works Test (SPEC-HIW)
            </option>
            <option value="Demolition Test (SPEC-DEM)">
              Demolition Test (SPEC-DEM)
            </option>
            <option value="Domestic Heating and Plumbing HVACR Test (SPEC-HAPS)">
              Domestic Heating and Plumbing HVACR Test (SPEC-HAPS)
            </option>
            <option value="Ductwork HVACR Test (SPEC-DUCT)">
              Ductwork HVACR Test (SPEC-DUCT)
            </option>
            <option value="Pipefitting and Welding HVACR Test (SPEC-PFW)">
              Pipefitting and Welding HVACR Test (SPEC-PFW)
            </option>
            <option value="Refrigeration and Air Conditioning HVACR Test (SPEC-RAAC)">
              Refrigeration and Air Conditioning HVACR Test (SPEC-RAAC)
            </option>
            <option value="Services and Facilities HVACR Test (SPEC-SAF)">
              Services and Facilities HVACR Test (SPEC-SAF)
            </option>
            <option value="Lift and Escalators Test (SPEC-LAEE)">
              Lift and Escalators Test (SPEC-LAEE)
            </option>
            <option value="Tunnelling Test (SPEC-TUNN)">
              Tunnelling Test (SPEC-TUNN)
            </option>
          </select>
        </label>
        <label>
          Test Language*:
          <select
            name="testLanguage"
            value={formData.testLanguage}
            onChange={handleChange}
          >
            <option value="">Please select one..</option>
            <option value="English">English</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Italian">Italian</option>
          </select>
        </label>
        <label>
          Date*:
          <input
            type="date"
            name="testDate"
            className="date"
            value={formData.testDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Time*:
          <select
            name="testTime"
            value={formData.testTime}
            onChange={handleChange}
          >
            <option value="Any">Any</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="12:00">12:00</option>
            <option value="13:00">13:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
            <option value="17:00">17:00</option>
            <option value="18:00">18:00</option>
          </select>
        </label>
        <h2>Address</h2>
        <label>
          Enter Postcode:
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
          />
        </label>
        <label>
          Address*:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Town/City*:
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
          Country*:
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
          Mobile Number*:
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email*:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Confirm Email*:
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
          booking is for the citb health, safety & environment test, as a
          requirement for cscs card eligibility.
        </label>
        <button type="submit">Checkout</button>
      </form>
    </div>
  );
};

export default Book;

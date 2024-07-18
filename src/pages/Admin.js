import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns"; // Import the format function from date-fns
import "../styles/admin.css"; // Import your CSS file

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/admin"); // Adjust endpoint as per your backend setup
        setAdminData(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  if (!adminData) {
    return <div>Loading...</div>;
  }

  const { customers, bookings } = adminData;

  // Assuming customers and bookings arrays are populated
  const combinedDetails = customers.map((customer, index) => {
    const booking = bookings[index]; // Assuming bookings array matches customers array
    return { customer, booking };
  });

  const formatDate = (dateString) => {
    // Use date-fns to format the date string
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  return (
    <div className="container">
      <div className="table-responsive">
        <h2>Combined Details</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>First Name</th>
              <th>Surname</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Town</th>
              <th>County</th>
              <th>Country</th>
              <th>Postcode</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Agree</th>
              <th>Test Date</th>
              <th>Test Time</th>
              <th>CSCS Card Type</th>
              <th>Card Action</th>
              <th>Test</th>
              <th>Test Language</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {combinedDetails.map((details, index) => (
              <tr key={index}>
                <td>{details.customer.title}</td>
                <td>{details.customer.firstName}</td>
                <td>{details.customer.surname}</td>
                <td>{`${details.customer.dateOfBirthDay}/${details.customer.dateOfBirthMonth}/${details.customer.dateOfBirthYear}`}</td>
                <td>{details.customer.gender}</td>
                <td>{details.customer.address}</td>
                <td>{details.customer.town}</td>
                <td>{details.customer.county}</td>
                <td>{details.customer.country}</td>
                <td>{details.customer.postcode}</td>
                <td>{details.customer.email}</td>
                <td>{details.customer.mobileNumber}</td>
                <td>{details.customer.agree ? "Yes" : "No"}</td>
                <td>{formatDate(details.booking.testDate)}</td>{" "}
                {/* Format the test date */}
                <td>{details.booking.testTime}</td>
                <td>{details.booking.cscsCardType}</td>
                <td>{details.booking.cardAction}</td>
                <td>{details.booking.test}</td>
                <td>{details.booking.testLanguage}</td>
                <td>{details.booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

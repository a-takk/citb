import React, { useEffect, useState } from "react";
import "../styles/admin.css";

const Admin = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch booking data from backend
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:4000/admin");
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Page</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th className="admin-table-header">CSCS Card Type</th>
            <th className="admin-table-header">Card Action</th>
            <th className="admin-table-header">Title</th>
            <th className="admin-table-header">First Name</th>
            <th className="admin-table-header">Surname</th>
            <th className="admin-table-header">Date of Birth</th>
            <th className="admin-table-header">Gender</th>
            <th className="admin-table-header">Test</th>
            <th className="admin-table-header">Test Language</th>
            <th className="admin-table-header">Test Date</th>
            <th className="admin-table-header">Test Time</th>
            <th className="admin-table-header">Address</th>
            <th className="admin-table-header">Town</th>
            <th className="admin-table-header">County</th>
            <th className="admin-table-header">Country</th>
            <th className="admin-table-header">Postcode</th>
            <th className="admin-table-header">Mobile Number</th>
            <th className="admin-table-header">Email</th>
            <th className="admin-table-header">Agree</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index} className="admin-table-row">
              <td className="admin-table-cell">{booking.cscsCardType}</td>
              <td className="admin-table-cell">{booking.cardAction}</td>
              <td className="admin-table-cell">{booking.title}</td>
              <td className="admin-table-cell">{booking.firstName}</td>
              <td className="admin-table-cell">{booking.surname}</td>
              <td className="admin-table-cell">{`${booking.dateOfBirthDay}-${booking.dateOfBirthMonth}-${booking.dateOfBirthYear}`}</td>
              <td className="admin-table-cell">{booking.gender}</td>
              <td className="admin-table-cell">{booking.test}</td>
              <td className="admin-table-cell">{booking.testLanguage}</td>
              <td className="admin-table-cell">{booking.testDate}</td>
              <td className="admin-table-cell">{booking.testTime}</td>
              <td className="admin-table-cell">{booking.address}</td>
              <td className="admin-table-cell">{booking.town}</td>
              <td className="admin-table-cell">{booking.county}</td>
              <td className="admin-table-cell">{booking.country}</td>
              <td className="admin-table-cell">{booking.postcode}</td>
              <td className="admin-table-cell">{booking.mobileNumber}</td>
              <td className="admin-table-cell">{booking.email}</td>
              <td className="admin-table-cell">
                {booking.agree ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;

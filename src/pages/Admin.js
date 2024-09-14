import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import "../styles/admin.css";

const AdminDashboard = () => {
  const [data, setData] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch("https://www.citbcertify.co.uk/api/admin");
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleDelete = async (customerId, bookingId) => {
    if (!customerId) {
      console.error("No user ID provided");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user and reset their booking?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://www.citbcertify.co.uk/api/admin/${customerId}`, // Ensure `id` is passed correctly here
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingId }), // Pass bookingId in the body
        }
      );

      if (response.ok) {
        setData(data.filter((item) => item.customerId !== customerId));
        alert("User deleted and booking reset successfully");
      } else {
        alert("Failed to delete user and reset booking");
      }
    } catch (error) {
      console.error("Error deleting user and resetting booking:", error);
    }
  };

  return (
    <div className="adminbackground">
      <div className="container">
        <div className="table-responsive">
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
                <th>Action</th> {/* Added Action column for delete button */}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{item.firstName}</td>
                  <td>{item.surname}</td>
                  <td>{`${item.dateOfBirthDay}/${item.dateOfBirthMonth}/${item.dateOfBirthYear}`}</td>
                  <td>{item.gender}</td>
                  <td>{item.address}</td>
                  <td>{item.town}</td>
                  <td>{item.county}</td>
                  <td>{item.country}</td>
                  <td>{item.postcode}</td>
                  <td>{item.email}</td>
                  <td>{item.mobileNumber}</td>
                  <td>{item.agree ? "Yes" : "No"}</td>
                  <td>
                    {item.testDate
                      ? format(new Date(item.testDate), "dd/MM/yyyy")
                      : ""}
                  </td>
                  <td>{item.testTime || ""}</td>
                  <td>{item.cscsCardType || ""}</td>
                  <td>{item.cardAction || ""}</td>
                  <td>{item.test || ""}</td>
                  <td>{item.testLanguage || ""}</td>
                  <td>{item.status || ""}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        console.log("Deleting user with ID:", item.customerId); // Add this to log the user ID
                        handleDelete(item.customerId, item.bookingId);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

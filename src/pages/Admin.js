import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import "../styles/admin.css";

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("cscs");

  useEffect(() => {
    console.log("Fetching data for tab:", activeTab);
    const fetchData = async () => {
      let url = activeTab === "cscs" ? "/api/admin" : "/api/admin/citb";
      try {
        const response = await fetch(`https://www.citbcertify.co.uk${url}`);
        const result = await response.json();
        console.log("Fetched Data:", result.data);
        setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [activeTab]);

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
        `https://www.citbcertify.co.uk/api/admin/${customerId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingId }),
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
      <div className="tab-container">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "cscs" ? "active" : ""}`}
            onClick={() => setActiveTab("cscs")}
          >
            CSCS User Details
          </button>
          <button
            className={`tab-button ${activeTab === "citb" ? "active" : ""}`}
            onClick={() => setActiveTab("citb")}
          >
            CITB User Details
          </button>
        </div>
      </div>
      <div className="container">
        <div className="table-responsive">
          {activeTab === "cscs" ? (
            <table className="table" key="cscs">
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
                  <th>Action</th>
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
                        onClick={() =>
                          handleDelete(item.customerId, item.bookingId)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="table" key="citb">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>First Name</th>
                  <th>Surname</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Postcode</th>
                  <th>Address</th>
                  <th>Town</th>
                  <th>County</th>
                  <th>Country</th>
                  <th>Mobile Number</th>
                  <th>Email</th>
                  <th>Agree</th>
                  <th>Action</th>
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
                    <td>{item.postcode}</td>
                    <td>{item.address}</td>
                    <td>{item.town}</td>
                    <td>{item.county}</td>
                    <td>{item.country}</td>
                    <td>{item.mobileNumber}</td>
                    <td>{item.email}</td>
                    <td>{item.agree ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item.customerId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

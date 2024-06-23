const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection Pooling
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

// Test MySQL connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed: ", err.stack);
    return;
  }
  console.log("Connected to MySQL database as id " + connection.threadId);
  connection.release(); // Release the connection back to the pool
});

// Function to send confirmation email
const sendConfirmationEmail = async (email, formData) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Booking Confirmation",
    text: `Thank you for your booking. Your booking details:\n\n${JSON.stringify(
      formData,
      null,
      2
    )}`,
  };

  await transporter.sendMail(mailOptions);
};

// Endpoint to handle form submission
app.post("/booked", async (req, res) => {
  const formData = req.body.formData;

  if (!formData) {
    res.status(400).send("Form data is missing");
    return;
  }

  const {
    cscsCardType,
    cardAction,
    title,
    firstName,
    surname,
    dateOfBirthDay,
    dateOfBirthMonth,
    dateOfBirthYear,
    gender,
    test,
    testLanguage,
    testDate,
    testTime,
    address,
    town,
    county,
    country,
    postcode,
    mobileNumber,
    email,
    agree,
  } = formData;

  const sql = `
    INSERT INTO booking (
      cscsCardType, cardAction, title, firstName, surname, 
      dateOfBirthDay, dateOfBirthMonth, dateOfBirthYear, gender, 
      test, testLanguage, testDate, testTime, address, town, 
      county, country, postcode, mobileNumber, email, agree
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    cscsCardType,
    cardAction,
    title,
    firstName,
    surname,
    dateOfBirthDay,
    dateOfBirthMonth,
    dateOfBirthYear,
    gender,
    test,
    testLanguage,
    testDate,
    testTime,
    address,
    town,
    county,
    country,
    postcode,
    mobileNumber,
    email,
    agree,
  ];

  try {
    // Execute MySQL query
    console.log("Attempting to insert into MySQL...");
    pool.query(sql, values, async (error) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Error executing query: " + error.sqlMessage);
        return;
      }

      console.log("Insert into MySQL successful!");

      // Send confirmation email
      try {
        console.log("Sending confirmation email...");
        await sendConfirmationEmail(email, formData);
        console.log("Confirmation email sent!");
        res
          .status(200)
          .send("Booking submitted successfully and confirmation email sent.");
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        res.status(500).send("Error sending confirmation email");
      }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Error processing request");
  }
});

app.get("/admin", (req, res) => {
  const query = `
    SELECT 
      cscsCardType, cardAction, title, firstName, surname, 
      dateOfBirthDay, dateOfBirthMonth, dateOfBirthYear, gender, 
      test, testLanguage, testDate, testTime, address, town, 
      county, country, postcode, mobileNumber, email, agree 
    FROM booking
  `;

  pool.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).send("Error fetching bookings");
    } else {
      res.json(results); // results contains the rows in MySQL
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

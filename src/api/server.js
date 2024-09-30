const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const stripe = require("stripe")(
  "sk_test_51E9RKSAwq1wpzpcjPFkYP9l7FmCz9MxpndHEnqs134t5xYB9lj8EztQ9QGhEr0ivHNTmpjvXFxc1dBr424kqgr2M00CqsMoCQh"
);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const ENDPOINT_SECRET = process.env.STRIPE_ENDPOINT_SECRET;
const ENDPOINT_SECRET_CITB = process.env.STRIPE_ENDPOINT_SECRET_CITB;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

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
  connection.release();
});

app.get("/api/admin", (req, res) => {
  const customerQuery = `
    SELECT
      customerId, title, firstName, surname, dateOfBirthDay, dateOfBirthMonth,
      dateOfBirthYear, gender, address, town, county, country, postcode, email,
      mobileNumber, agree
    FROM customer_details
  `;

  const bookingQuery = `
    SELECT
      bookingId, testDate, testTime, cscsCardType, cardAction, test, testLanguage, status
    FROM booking_details
    WHERE testDate IS NOT NULL AND testTime IS NOT NULL AND cscsCardType IS NOT NULL
    AND cardAction IS NOT NULL AND test IS NOT NULL AND testLanguage IS NOT NULL AND status IS NOT NULL
  `;

  pool.query(customerQuery, (error, customerResults) => {
    if (error) {
      console.error("Error fetching customer data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Run the second query to get booking details
    pool.query(bookingQuery, (error, bookingResults) => {
      if (error) {
        console.error("Error fetching booking data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      const combinedResults = customerResults.map((customer, index) => {
        const booking = bookingResults[index] || {};
        return {
          ...customer,
          ...booking,
        };
      });
      res.json({ data: combinedResults });
    });
  });
});

app.delete("/api/admin/:customerId", (req, res) => {
  const { customerId } = req.params.id;
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: "No booking ID provided" });
  }

  console.log(`Deleting user with customerId: ${customerId}`);

  const deleteQuery = "DELETE FROM customer_details WHERE customerId = ?";

  db.query(deleteQuery, [customerId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ error: "Error deleting user" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetBookingQuery = `
      UPDATE booking_details 
      SET cscsCardType = NULL, 
          cardAction = NULL, 
          test = NULL, 
          testLanguage = NULL, 
          testDate = originalTestDate,  
          testTime = originalTestTime,  
          status = 'available'          
      WHERE bookingId = ?`;

    db.query(resetBookingQuery, [bookingId], (resetErr, resetResult) => {
      if (resetErr) {
        console.error("Error resetting booking details:", resetErr);
        return res
          .status(500)
          .json({ error: "Error resetting booking details" });
      }

      if (resetResult.affectedRows === 0) {
        return res.status(404).json({ error: "Booking not found" });
      }

      console.log("Booking details reset for bookingId:", bookingId);
      res.json({
        message: "User deleted and booking details reset successfully",
      });
    });
  });
});

app.post("/api/admin-login", (req, res) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === adminUsername && password === adminPassword) {
    res.status(200).json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Function to send confirmation email
const sendContactEmail = async (email, formData) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    from: process.env.EMAIL_USER,
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: "CITB: Email sent from customer",
    text: `An email has been sent from the customer, here is their details:\n
Name: ${formData.name}
Email: ${formData.email}
Message: ${formData.message}`,
  };

  await transporter.sendMail(mailOptions);
};

const sendAdminEmail = async (formData) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    from: process.env.EMAIL_USER,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "CITB: Customer has booked for a test",
    text: `A customer has booked for a test, here are the details:\n
CSCS Card Type: ${formData.cscsCardType}
Card Action: ${formData.cardAction}
Title: ${formData.title}
First Name: ${formData.firstName}
Surname: ${formData.surname}
Date of Birth: ${formData.dateOfBirthDay}/${formData.dateOfBirthMonth}/${formData.dateOfBirthYear}
Gender: ${formData.gender}
Test: ${formData.test}
Test Language: ${formData.testLanguage}
Test Date: ${formData.testDate}
Test Time: ${formData.testTime}
Address: ${formData.address}
Town: ${formData.town}
County: ${formData.county}
Country: ${formData.country}
Postcode: ${formData.postcode}
Mobile Number: ${formData.mobileNumber}
Email: ${formData.email}
Confirm Email: ${formData.confirmEmail}
Agree: ${formData.agree}`,
  };
  await transporter.sendMail(mailOptions);
};

const sendBookingEmail = async (email, formData) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    from: process.env.EMAIL_USER,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "CITB: Thank You For Booking",
    text: `Dear ${formData.firstName} ${formData.surname},

Thank you for booking your CSCS test, your booking details are:\n

Card Type: ${formData.cscsCardType}
Test Type: ${formData.test}
Test Date:  ${formData.testDate}
Test Time:  ${formData.testTime}

Thank you for booking your CSCS test. We will soon be in contact with you.
If you have any questions, feel free to contact us.

Best regards,
CITB Certify`,
  };

  await transporter.sendMail(mailOptions);
};

const sendBookingEmailCITB = async (email, formData) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    from: process.env.EMAIL_USER,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "CITB Test Booking Confirmation",
    text: `
Dear ${formData.firstName} ${formData.surname},

Thank you for booking your CITB test. We will soon be in contact with you.
If you have any questions, feel free to contact us.

Best regards,
CITB Certify`,
  };

  await transporter.sendMail(mailOptions);
};

const sendAdminEmailCITB = async (formData) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    from: process.env.EMAIL_USER,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "New CITB Test Booking",
    text: `
A new CITB test booking has been made. Below are the details:

Name: ${formData.title} ${formData.firstName} ${formData.surname}
Date of Birth: ${formData.dateOfBirthDay}/${formData.dateOfBirthMonth}/${formData.dateOfBirthYear}
Gender: ${formData.gender}
Address: ${formData.address}, ${formData.town}, ${formData.county}, ${formData.country}, ${formData.postcode}
Mobile Number: ${formData.mobileNumber}
Email: ${formData.email}`,
  };

  await transporter.sendMail(mailOptions);
};

app.post("/api/email-sent", async (req, res) => {
  const { email, formData } = req.body;

  try {
    console.log("Received email request:", { email, formData });
    await sendContactEmail(email, formData);
    console.log("Contact email sent successfully to:", email);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

app.post("/api/create-checkout-session-citb", async (req, res) => {
  const { formData, price } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "CITB Test",
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://www.citbcertify.co.uk/success",
      cancel_url: "https://www.citbcertify.co.uk/failure",
      customer_email: formData.email,
      metadata: formData,
    });

    // Send back the session ID
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.post("/api/create-checkout-session", async (req, res) => {
  const { test, price, formData } = req.body;
  const { testDate, testTime } = formData;

  try {
    console.log("Received create checkout session request:", {
      test,
      price,
      formData,
    });

    const query =
      "SELECT * FROM booking_details WHERE test = ? AND testDate = ? AND testTime = ?";
    pool.query(query, [test, testDate, testTime], async (error, results) => {
      if (error) {
        console.error("Error checking availability:", error);
        return res.status(500).send("Error checking availability");
      }

      if (results.length > 0) {
        console.log("Selected date and time are already booked:", {
          test,
          testDate,
          testTime,
        });
        return res
          .status(400)
          .send("Selected date and time are already booked");
      }

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "gbp",
                product_data: { name: test },
                unit_amount: price * 100,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: "https://www.citbcertify.co.uk/success",
          cancel_url: "https://www.citbcertify.co.uk/failure",
          customer_email: formData.email,
          metadata: formData,
        });

        console.log("Stripe session created successfully:", session.id);
        res.json({ sessionId: session.id });
      } catch (stripeError) {
        console.error("Error creating Stripe session:", stripeError);
        res.status(500).json({ error: "Failed to create Stripe session" });
      }
    });
  } catch (error) {
    console.error("Error in create-checkout-session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

app.get("/api/cscs-test-prices", (req, res) => {
  const query = "SELECT * FROM cscs_test_prices";
  pool.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching test prices:", error);
      res.status(500).json({ error: "Error fetching test prices" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/api/available-slots", async (req, res) => {
  const { date } = req.query;

  try {
    const results = await fetchAvailableSlotsFromDB(date);
    console.log("Fetched slots:", results); // Log fetched slots
    res.json(results);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function fetchAvailableSlotsFromDB(date) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT testTime FROM booking_details WHERE testDate = ? AND status = 'available'";
    pool.query(sql, [date], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

app.post(
  "/api/webhook/citb",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const payloadString = req.body.toString();
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: ENDPOINT_SECRET_CITB,
    });

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        payloadString,
        header,
        ENDPOINT_SECRET_CITB
      );
      console.log("Webhook verified successfully:", event);
    } catch (err) {
      console.log("Webhook verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === "checkout.session.completed") {
        await handleCheckoutSessionCompletedCITB(event.data.object);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error processing webhook event:", error);
      res.status(500).send("Error processing webhook event");
    }
  }
);

async function handleCheckoutSessionCompletedCITB(session) {
  const email = session.customer_details.email;
  const formData = session.metadata || {};

  try {
    const insertCustomerQuery = `
      INSERT INTO citb_customer_details (
        title, firstName, surname, dateOfBirthDay, dateOfBirthMonth,
        dateOfBirthYear, gender, postcode, address, town, county, country,
        mobileNumber, email, agree
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const agree = formData.agree === "true" ? 1 : 0;

    await new Promise((resolve, reject) => {
      pool.query(
        insertCustomerQuery,
        [
          formData.title,
          formData.firstName,
          formData.surname,
          formData.dateOfBirthDay,
          formData.dateOfBirthMonth,
          formData.dateOfBirthYear,
          formData.gender,
          formData.address,
          formData.town,
          formData.county,
          formData.country,
          formData.postcode,
          formData.mobileNumber,
          email,
          agree,
        ],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    console.log("Customer details inserted successfully");

    try {
      await sendBookingEmailCITB(email, formData);
      await sendAdminEmailCITB(formData);
      console.log("Emails sent successfully");
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
    }
  } catch (error) {
    console.error("Error inserting customer details:", error);
    throw error;
  }
}

app.post("/api/webhook", async (req, res) => {
  const payload = req.body;
  const payloadString = JSON.stringify(payload, null, 2);
  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: ENDPOINT_SECRET,
  });

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payloadString,
      header,
      ENDPOINT_SECRET
    );
    console.log("Webhook Verified:", event);
  } catch (err) {
    console.log("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error processing webhook event:", error);
    res.status(500).send("Error processing webhook event");
  }
});

async function handleCheckoutSessionCompleted(session) {
  const email = session.customer_details.email;
  const formData = session.metadata || {};

  try {
    // Check if the slot exists and is available
    const checkExistingQuery = `
      SELECT bookingId FROM booking_details
      WHERE testDate = ? AND testTime = ? AND status = 'available'
    `;
    const checkExistingParams = [formData.testDate, formData.testTime];

    const existingBooking = await new Promise((resolve, reject) => {
      pool.query(checkExistingQuery, checkExistingParams, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]); // Get the first matching booking if any
        }
      });
    });

    if (!existingBooking) {
      console.log("No available slot found for selected date and time:", {
        testDate: formData.testDate,
        testTime: formData.testTime,
      });
      return;
    }

    const bookingId = existingBooking.bookingId;
    const insertCustomerQuery = `
      INSERT INTO customer_details (
        title, firstName, surname, dateOfBirthDay, dateOfBirthMonth,
        dateOfBirthYear, gender, address, town, county, country,
        postcode, email, mobileNumber, agree
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const agree = formData.agree === "true" ? 1 : 0;
    await new Promise((resolve, reject) => {
      pool.query(
        insertCustomerQuery,
        [
          formData.title,
          formData.firstName,
          formData.surname,
          formData.dateOfBirthDay,
          formData.dateOfBirthMonth,
          formData.dateOfBirthYear,
          formData.gender,
          formData.address,
          formData.town,
          formData.county,
          formData.country,
          formData.postcode,
          email,
          formData.mobileNumber,
          agree,
        ],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    // Update the booking slot with new details
    const updateBookingQuery = `
      UPDATE booking_details
      SET
        cscsCardType = ?,
        cardAction = ?,
        test = ?,
        testLanguage = ?,
        status = 'booked'
      WHERE
        bookingId = ?
    `;

    await new Promise((resolve, reject) => {
      pool.query(
        updateBookingQuery,
        [
          formData.cscsCardType,
          formData.cardAction,
          formData.test,
          formData.testLanguage,
          bookingId, // Update the specific slot
        ],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    console.log("Booking details updated successfully");

    // Send confirmation emails
    try {
      await Promise.all([
        sendBookingEmail(email, formData),
        sendAdminEmail(formData),
      ]);
      console.log("Confirmation emails sent successfully");
    } catch (emailError) {
      console.error("Error sending confirmation emails:", emailError);
    }
  } catch (error) {
    console.error("Error handling checkout session:", error);
    throw error; // Throw the error to be handled at a higher level
  }
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

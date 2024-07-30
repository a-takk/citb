const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const cors = require("cors");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const dotenv = require("dotenv");
const stripe = require("stripe")(
  "sk_test_51E9RKSAwq1wpzpcjPFkYP9l7FmCz9MxpndHEnqs134t5xYB9lj8EztQ9QGhEr0ivHNTmpjvXFxc1dBr424kqgr2M00CqsMoCQh"
);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const ENDPOINT_SECRET = process.env.STRIPE_ENDPOINT_SECRET;

app.use(express.json());
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
      title, firstName, surname, dateOfBirthDay, dateOfBirthMonth,
      dateOfBirthYear, gender, address, town, county, country, postcode, email,
      mobileNumber, agree
    FROM customer_details
  `;

  // Fetch booking details, excluding rows with null values
  const bookingQuery = `
    SELECT
      testDate, testTime, cscsCardType, cardAction, test, testLanguage, status
    FROM booking_details
    WHERE testDate IS NOT NULL AND testTime IS NOT NULL AND cscsCardType IS NOT NULL
    AND cardAction IS NOT NULL AND test IS NOT NULL AND testLanguage IS NOT NULL AND status IS NOT NULL
  `;

  // Run the first query to get customer details
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

// Function to send confirmation email
const sendContactEmail = async (email, formData) => {
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
    subject: "CITB: Email sent from customer",
    text: `Thank you for contacting us. Here are the details of your message:\n
      Name: ${formData.name}
      Email: ${formData.email}
      Message: ${formData.message}`,
  };

  await transporter.sendMail(mailOptions);
};

const sendAdminEmail = async (email, formData) => {
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
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "CITB: Thank You For Booking",
    text: `Thank you for booking your CITB test, your booking details are:\n
    Card Type: ${formData.cscsCardType}
    Test Type: ${formData.test}
    Test Date:  ${formData.testDate}
    Test Time:  ${formData.testTime}`,
  };

  await transporter.sendMail(mailOptions);
};

// Route to handle contact email sending
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

// Route to create checkout session
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
          success_url: "https://citbcertify-20840f8ccc0e.herokuapp.com/success",
          cancel_url: "https://citbcertify-20840f8ccc0e.herokuapp.com/failure",
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

// Route to fetch CSCS test prices
app.get("/api/cscs-test-prices", (req, res) => {
  const query = "SELECT * FROM cscs_test_prices";
  pool.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching test prices:", error);
      res.status(500).json({ error: "Error fetching test prices" });
    } else {
      res.status(200).json(results); // Send the results array
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

// Function to fetch available slots from the database
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

// Webhook endpoint to handle Stripe events
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

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case "payment_method.attached":
        console.log("PaymentMethod was attached to a Customer!");
        break;

      case "charge.updated":
        console.log("Charge updated:", event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
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
      return; // Exit if no available slot is found
    }

    const bookingId = existingBooking.bookingId;

    // Insert customer details into the database
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
        sendAdminEmail(email, formData),
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

// Function to handle actions after successful payment intent
async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log("Payment Intent succeeded:", paymentIntent.id);
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

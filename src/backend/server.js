const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser"); // Add this line
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require("dotenv");
const stripe = require("stripe")(
  "sk_test_51E9RKSAwq1wpzpcjPFkYP9l7FmCz9MxpndHEnqs134t5xYB9lj8EztQ9QGhEr0ivHNTmpjvXFxc1dBr424kqgr2M00CqsMoCQh"
);
const endpointSecret =
  "whsec_5af4f39bda271aa46c03a902186e2f5b7dd388fd0df1c98a0a956a538af6d026";

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());

// Stripe webhook endpoint to listen for events
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Log session data for debugging
      console.log("Checkout session completed:", session);

      // Retrieve the customer email and booking details from the session metadata
      const email = session.customer_details.email;
      const formData = session.metadata;

      // Log email and formData for debugging
      console.log("Customer email:", email);
      console.log("Form data:", formData);

      // Send confirmation email
      sendBookingEmail(email, formData)
        .then(() => console.log(`Confirmation email sent to ${email}`))
        .catch((error) => console.error(`Error sending email:`, error));
    }

    response.status(200).send("Event received");
  }
);

// Apply body-parser middleware after webhook route
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
    text: `Thank you for contacting us. Your message details:\n\n${JSON.stringify(
      formData,
      null,
      2
    )}`,
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
    subject: "CITB Booking Confirmation",
    text: `Customer has booked for a CITB test, their booking details are:\n\n${JSON.stringify(
      formData,
      null,
      2
    )}`,
  };

  await transporter.sendMail(mailOptions);
};

// Endpoint to create Stripe checkout session
app.post("/create-checkout-session", async (req, res) => {
  const { test, price, formData } = req.body; // Ensure formData is received in the request body

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: test,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/failure",
      metadata: formData, // Add formData as metadata
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Admin endpoint to fetch bookings
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
      res.json(results);
    }
  });
});

// New endpoint to send test email
app.post("/email-sent", async (req, res) => {
  const { email, formData } = req.body;
  try {
    await sendContactEmail(email, formData);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

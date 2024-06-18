const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/booked", async (req, res) => {
  const { formData } = req.body;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Email credentials are not set in environment variables");
    return res
      .status(500)
      .send("Server configuration error: Email credentials are missing");
  }

  // Create transporter object
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "amantaak1999@hotmail.com", // Replace with your recipient's email address
    subject: "New Form Submission",
    text: JSON.stringify(formData, null, 2),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res.status(200).send("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email: " + error.toString());
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

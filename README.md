# CITB Certify

**CITB Certify** is an online platform that allows users to book their basic Health and Safety test, required for obtaining the CSCS card qualification in the UK construction
sector. The project streamlines the process for candidates to register their details and schedule the CITB test, helping ensure safety compliance on construction sites.

## Features

- **Online Booking:** Simple web form for users to register and book their CITB Health, Safety & Environment test.
- **Secure Checkout:** Integration with Stripe for payments and secure handling of customer details.
- **Personal Details Collection:** Collects required information (name, date of birth, address, etc.) for test registration.
- **Terms & Conditions:** Users must agree to terms before booking is completed.

## Live Website

Website was live however I have removed it due to other projects being more of a priority

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js (API)
- **Database:** (MySQL)
- **Payment:** Stripe Integration

## Project Structure

- `src/pages/BookCITB.js` — Main booking form and client-side logic.
- `src/api/server.js` — Backend API for handling bookings and storing customer details.
- `public/` and `build/` — Static files for deployment.

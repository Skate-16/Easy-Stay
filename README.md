# Easy-Stay
Go to Travelling website

[Live Demo](https://easy-stay-uu8d.onrender.com) | [GitHub Repository](https://github.com/Skate-16/Easy-Stay)


Project Overview

Easy Stay is a robust real estate booking platform built using Node.js, Express, MongoDB, and EJS. It enables users to discover, list, and review accommodations with secure authentication and intuitive error handling.


Features

1. User Authentication & Authorization
   - Google OAuth Login: Users can sign up or log in using their Google account for quick and secure authentication.
   - Signup & Login: Users can register with email and password; passwords are hashed for security.
   - Session Management: Persistent sessions using express-session and secure cookies.
   - Access Control: Middleware ensures only authenticated users can add stays/reviews; owners can edit or delete their listings.

2. Stays Management (CRUD)
   - Create Stay: Authenticated users fill a form with title, description, price, location, country, and upload images via Cloudinary.
   - Read/List Stays: Dynamic index page lists all stays with pagination and average rating displayed.
   - Update Stay: Owners can access an edit form pre-populated with existing data and update any field.
   - Delete Stay: Owners can remove their listings; cascading deletes handle associated reviews.

3. Search & Filters
   - Keyword Search: Search bar supports full-text queries across title, description, location, and country fields using MongoDB’s text indexes.
   - Filter by Country & Price Range: Dropdowns and range inputs refine results.
   - Responsive Display: On smaller screens, filters collapse into a toggleable menu.

4. Reviews & Ratings
   - Add Review: Authenticated users submit reviews with star ratings and comments; form validation prevents empty submissions.
   - Edit/Delete Review: Review authors can modify or remove their own feedback.
   - Average Rating Calculation: Aggregated ratings displayed on stay cards and detail pages.

5. Location Mapping
   - Mapbox Integration: Stays detail page shows interactive map with geocoded location markers.
   - Geocoding Utility: Server-side utility transforms address input into coordinates via Mapbox API.

6. Error Handling
   - Custom ExpressError Class: Standardizes error creation with status codes and messages.
   - Global Error Middleware: Catches and renders user-friendly error pages for 404, 400, and 500 statuses.

7. Image Uploads & Storage
   - Cloudinary Setup: Middleware uploads images from forms, returns URLs and public IDs.
   - Image Management: On stay deletion, associated images are removed from Cloudinary.

8. Razorpay Payment Integration (Test Mode Only)
   - Payment Enabled Booking: Users must select check-in and check-out dates. Pricing is based on daily rate × number of days + 18% GST.
   - Razorpay Checkout: Secure and dynamic payment gateway for booking listings.
   - Booking Restrictions: Owners cannot book their own listings.

Working Razorpay Flow:
   - Automatically calculates total booking cost + GST.
   - Generates dynamic Razorpay order and charges the user.
   - Saves payment ID and booking info to MongoDB.

Test Mobile numbers for simulation (India - 91):
+91-9900000001
+91-9900000002

Test Cards for Simulation:

DISCLAIMER: Payments are in "test mode only". No real transactions are made.

| Card Type | Card Number           | CVV | Expiry | Description           |
|-----------|------------------------|-----|--------|-----------------------|
| RuPay     | `6080 0000 0000 0000`  | 123 | 12/28  | Recommended (India) |
| Visa      | `5123 4567 8901 2346`  | 123 | 12/28  | HDFC Visa           |
| ICICI Visa| `4854 1965 2623 4106`  | 123 | 12/28  | Success             |
| Failed Txn| `4000 0027 6000 0007`  | 123 | 12/28  | Simulates failure   |

---

Project Structure

├── public            # Static assets: CSS, client-side JS, images
├── views             # EJS templates (layouts, partials, pages)
│   ├── partials      # Navbar, footer, flash messages
│   └── listings      # Index, show, new, edit views
├── routes            # Express routers (listings.js, reviews.js, users.js, payment.js)
├── controllers       # Logic for users, listings, reviews, payment, booking, filters
├── models            # Mongoose schemas: User, Listing, Review
├── middleware        # Auth, error handling, validation
├── utils             # ExpressError class, wrapAsync, JOI validators
├── oauth
│   └── passport.js   # Google OAuth strategy configuration
├── app.js            # Express app: middleware, sessions, routes
├── .env              # Not committed: includes secret keys for MongoDB Atlas, Cloudinary, Mapbox, Razorpay, Google OAuth


License

This project is licensed under MIT.



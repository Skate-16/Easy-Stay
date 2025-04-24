# Easy-Stay
Go to Travelling website

[Live Demo](https://easy-stay-j5ay.onrender.com) | [GitHub Repository](https://github.com/Skate-16)



Project Overview

Easy Stay is a robust real estate booking platform built using Node.js, Express, MongoDB, and EJS. It enables users to discover, list, and review accommodations with secure authentication and intuitive error handling.



Features

1. User Authentication & Authorization
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

8. Project Structure


├── public           # Static assets: CSS, client-side JS, images
├── views            # EJS templates (layouts, partials, pages)
│   ├── partials     # Navbar, footer, flash messages
│   └── stays        # Index, show, new, edit views
├── routes           # Express routers (stays.js, reviews.js, users.js)
├── controllers      # Handler functions separated by resource
├── models           # Mongoose schemas: User, Stay, Review
├── middleware       # auth checks, error handling, validation
├── utils            # ExpressError class, Joi schemas for validation
├── app.js           # Express app setup: middleware, routes, error handler


License

This project is licensed under MIT.



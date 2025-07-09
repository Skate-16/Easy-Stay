const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");

router.post("/:id/book", isLoggedIn, wrapAsync(bookingController.bookListing));

module.exports = router;
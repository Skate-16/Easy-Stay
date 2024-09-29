const express = require("express")
const router = express.Router({mergeParams: true})
const wrapAsync = require("../utils/wrapAsync.js")
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviewsController.js")

// router.route method can be used to combine two or more
// routes connecting to same route

//Reviews Post Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.postReview))

//Reviews Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router
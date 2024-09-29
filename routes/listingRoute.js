const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")
const listingController = require("../controllers/listingsController.js")
const filterController = require("../controllers/filterController.js")
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

// router.route method can be used to combine two or more
// routes connecting to same route

//Index and Create Routes
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, 
    upload.single("listing[image]"), 
    validateListing,
    wrapAsync(listingController.createListing))

//Navbar Search Route
router.get('/search', listingController.searchListings);

//Filter Routes
router.get("/farms", wrapAsync(filterController.farms))

router.get("/rooms", wrapAsync(filterController.rooms))

router.get("/beachfronts", wrapAsync(filterController.beachfronts))

router.get("/mansions", wrapAsync(filterController.mansions))

router.get("/arctic", wrapAsync(filterController.arctic))

router.get("/tropical", wrapAsync(filterController.tropical))

router.get("/mountains", wrapAsync(filterController.mountains))

//New Route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm))

//Show, Update and Delete Routes
router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn, isOwner, 
    upload.single("listing[image]"), 
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing))

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing))

module.exports = router
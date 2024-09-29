const express = require("express")
const router = express.Router()

const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware.js")
const userController = require("../controllers/usersController.js")

// router.route method can be used to combine two or more
// routes connecting to same route

router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signupUser))

router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.loginUser)

router.get("/logout", userController.logoutUser)

module.exports = router
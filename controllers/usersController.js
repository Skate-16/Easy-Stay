const User = require("../models/user.js")
const passport = require("passport");

module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signupUser = async(req, res) => {
    try {
        let {username, email, password} = req.body
        const newUser = new User({email, username})
        const registeredUser = await User.register(newUser, password)
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err)
            }
            req.flash("success", `Welcome to Easy Stay ${username}!`)
            res.redirect("/listings")
        })
    }
    catch(err) {
        req.flash("error", err.message)
        res.redirect("/signup")
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.loginUser = async(req, res) => {
    let {username} = req.body
    req.flash("success",`You're logged in! Welcome back ${username}!`)
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You are logged out!")
        res.redirect("/listings")
    })
}

module.exports.googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"]
})

module.exports.googleCallback = [
    passport.authenticate("google", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success",`You're logged in! Welcome back ${req.user.username}!`)
        res.redirect("/listings");
    }
]
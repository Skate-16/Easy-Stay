if(process.env.NODE_ENV != "production") {
    require("dotenv").config()
}

console.log(process.env.SECRET)

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")
const wrapAsync = require("./utils/wrapAsync.js")

const listings = require("./routes/listingRoute.js")
const reviews = require("./routes/reviewRoute.js")
const user = require("./routes/userRoute.js")

// const dbURL = process.env.ATLASDB_URL
const dbURL= "mongodb://localhost:27017/EasyStay"

main()
    .then(() => {
        console.log("Connected to DB")
    })
    .catch((err) => {
        console.log(err)
    })

async function main() {
    await mongoose.connect(dbURL)
}

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
})

store.on("error", () => {
    console.log("Error in Mongo Session Store", err)
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})

//Home Page 
app.get("/", wrapAsync(async (req,res) => {
    res.render("home/home.ejs")
}))

//Listings Route
app.use("/listings", listings)

//Privacy and Terms Route
app.get("/privacy", wrapAsync(async (req,res) => {
    res.render("footerControls/privacy.ejs")
}))

app.get("/terms", wrapAsync(async (req,res) => {
    res.render("footerControls/terms.ejs")
}))

//Reviews Route
app.use("/listings/:id/reviews", reviews)

//User Route
app.use("/", user)

//Wrong Route Error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})

//Error Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err
    res.status(statusCode).render("listings/error.ejs", { err })
})

app.listen(process.env.PORT || 8080, () => {
    console.log("Listening on port", process.env.PORT || 8080);
});



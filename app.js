const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema} = require("./schema.js")

const MONGO_URL = "mongodb://localhost:27017/EasyStay"

main()
.then(() => {
    console.log("Connected to DB")
})
.catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect(MONGO_URL)
}

app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

app.get("/", (req, res) => {
    res.send("Checking")
})

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body)
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

//Index route
app.get("/listings", wrapAsync(async (req,res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}))

//New Route
app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs")
}))

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", {listing})
}))

//Create Route
app.post("/listings", validateListing,
    wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing)
    await newListing.save()
    res.redirect("/listings")
}))

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs", {listing})
}))

//Update Route
app.put("/listings/:id", validateListing,
    wrapAsync(async (req, res) => {
    let {id} = req.params
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
}))

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
}))

//Wrong Route Error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})

//Error Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err
    res.status(statusCode).render("listings/error.ejs", {err})
    // res.status(statusCode).send(message)
})

app.listen(8080, () => {
    console.log("Listening to port 8080")
})

// app.get("/test" , async (req, res) => {
//     let samplelist = new Listing ({
//         title:"Villa",
//         description: "Excellent view",
//         price: 50000,
//         location: "Nagpur",
//         country: "India"
//     })
//     await samplelist.save()
//     res.send("Successful")
// })


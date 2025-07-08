const Listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.searchListings = async (req, res) => {
    const searchTerm = req.query.q;
    try {
        const allListings = await Listing.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { location: { $regex: searchTerm, $options: 'i' } },
                { country: { $regex: searchTerm, $options: 'i' } }
            ]
        });
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error(err);
        res.redirect("/listings");
    }
};

module.exports.showListings = async (req, res) => {
    let {id} = req.params
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner")
    if(!listing) {
        req.flash("error", "Requested Stay does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", {listing,
    token: process.env.MAP_TOKEN})
}

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()

    let url = req.file.path
    let filename = req.file.filename
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    newListing.image = {url, filename}
    newListing.geometry = response.body.features[0].geometry
    await newListing.save()
    req.flash("success", "New stay created!")
    res.redirect("/listings")
}

module.exports.editListing = async (req, res) => {
    let {id} = req.params
    const listing = await Listing.findById(id)
    if(!listing) {
        req.flash("error", "Requested Stay does not exist!")
        res.redirect("/listings")
    }
    let orgImgUrl = listing.image.url
    orgImgUrl = orgImgUrl.replace("/upload","/upload/w_200")
    res.render("listings/edit.ejs", {listing, orgImgUrl})
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})

    if (typeof req.file !== "undefined") {
        let url = req.file.path
        let filename = req.file.filename
        listing.image = {url, filename}
        await listing.save()
    }
    req.flash("success", "Stay updated!")
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Stay deleted!")
    res.redirect("/listings")
}
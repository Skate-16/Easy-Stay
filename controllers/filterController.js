const Listing = require("../models/listing.js")

module.exports.farms = async (req,res) => {
    const allListings = await Listing.find({})
    res.render("filters/farms.ejs", { allListings })
}

module.exports.rooms = async (req,res) => {
    const allListings = await Listing.find({})
    res.render("filters/rooms.ejs", { allListings })
}

module.exports.beachfronts = async (req,res) => {
    const allListings = await Listing.find({})
    res.render("filters/beachfronts.ejs", { allListings })
}

module.exports.mansions = async (req,res) => {
    const allListings = await Listing.find({})
    res.render("filters/mansions.ejs", { allListings })
}

module.exports.arctic = async (req,res) => {
    const allListings = await Listing.find({})
    res.render("filters/arctic.ejs", { allListings })
}

module.exports.tropical = async (req,res) => {
    const allListings = await Listing.find({})
    res.render("filters/tropical.ejs", { allListings })
}

module.exports.mountains = async (req,res) => {
    const allListings = await Listing.find({})
    res.render("filters/mountains.ejs", { allListings })
}
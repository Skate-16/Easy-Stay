const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require("./review.js")
const { required } = require("joi")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    category: {
        type: String,
        enum: ["Farms","Rooms","Beach Fronts","Mansions","Arctic","Tropical","Mountains"],
        required: true
    },
    location: String,
    country: String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    bookings: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      razorpay_payment_id: String,
      bookedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
})

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing
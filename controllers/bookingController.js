const Listing = require("../models/listing");

module.exports.bookListing = async (req, res) => {
  const { id } = req.params;
  const { razorpay_payment_id } = req.body;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  listing.bookings.push({
    user: req.user._id,
    razorpay_payment_id
  });
  await listing.save();

  req.flash("success", "Booking confirmed!");
  res.redirect(`/listings/${id}`);
};
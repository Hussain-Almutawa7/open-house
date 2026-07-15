const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"
    },
    streetAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
        min: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true
});

const Listing = mongoose.model("Listing", listingSchema)

module.exports = Listing;
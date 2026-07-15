const Listing = require("../models/listing");

const showNewForm = (req, res) => {
    res.render("listings/new.ejs", {
        user: req.session.user
    });
}

const createList = async (req, res) => {
    // console.log(req.session);
    // res.send(req.body);

    const listData = {
        price: req.body.price,
        streetAddress: req.body.streetAddress,
        city: req.body.city,
        size: req.body.size,
        owner: req.session.user.id
    }

    if (req.body.image) {
        listData.image = req.body.image;
    }

    // listData.owner = req.body.owner,

    let createdList = await Listing.create(listData);
    res.redirect("/listings")
}

let listListing = async (req, res) => {
    let allList = await Listing.find().populate("owner");

    res.render("listings/index.ejs", { allList });
}

let listingDetails = async (req, res) => {
    let list = Listing.findById(req.params.Id);

    res.render("listings/show.ejs", {list});
}

module.exports = {
    showNewForm,
    createList,
    listListing,
    listingDetails,
}
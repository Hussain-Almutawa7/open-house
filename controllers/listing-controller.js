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

const listListing = async (req, res) => {
    let allList = await Listing.find().populate("owner");

    res.render("listings/index.ejs", { allList });
}

const listingDetails = async (req, res) => {
    let list = await Listing.findById(req.params.Id).populate("owner");

    res.render("listings/show.ejs", { list });
}

const deleteListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.Id)
    res.redirect("/listings")

    // const list = await Listing.findById(req.params.Id)

    // if (list.owner.equals(req.session.user.id)) {
    //     await Listing.findByIdAndDelete(req.params.Id)
    //     res.redirect("/listings")
    // } else {
    //     res.render("error.ejs", {
    //         msg: "You don't have permission to do that"
    //     });
    // }
}

const showEditListing = async (req, res) => {
    const list = await Listing.findById(req.params.Id)

    res.render("listings/edit.ejs", { list })
}

const editListing = async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.Id, req.body)
    res.redirect(`/listings/${req.params.Id}`)
}

module.exports = {
    showNewForm,
    createList,
    listListing,
    listingDetails,
    deleteListing,
    showEditListing,
    editListing,
}
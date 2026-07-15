const Listing = require("../models/listing");

const showNewForm = (req, res) => {
    res.render("listings/new.ejs", {
        user: req.session.user
    });
}

const createList = async (req, res) => {
    console.log(req.session);
    res.send(req.body);
}

module.exports = {
    showNewForm,
    createList,
}
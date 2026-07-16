const Listing = require("../models/listing.js")

const create = async (req, res) => {
    const foundList = await Listing.findById(req.params.Id)

    const questionData = {
        text: req.body.text,
        author: req.session.user.id
    }

    foundList.questions.push(questionData);
    await foundList.save()

    res.redirect(`/listings/${req.params.Id}`);
}

module.exports = {
    create,
}
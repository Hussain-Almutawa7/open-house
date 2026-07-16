const Listing = require("../models/listing");
const cloudinary = require("../config/cloudinary");

const uploadImage = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'open-house/listings',
                resource_type: 'image',
            },
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            }
        )

        uploadStream.end(fileBuffer)
    })
}


const showNewForm = (req, res) => {
    res.render("listings/new.ejs", {
        user: req.session.user
    });
}

const createList = async (req, res) => {
    // console.log(req.session);
    // res.send(req.body);

    if (!req.file) {
        res.render("error.ejs", {
            msg: "Please select an image"
        });
    }

    const uploadedImage = await uploadImage(req.file.buffer);

    const listData = {
        price: req.body.price,
        streetAddress: req.body.streetAddress,
        city: req.body.city,
        size: req.body.size,
        owner: req.session.user.id,
        image: {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id
        }
    }

    if (req.body.image) {
        listData.image = req.body.image;
    }

    // listData.owner = req.body.owner,

    let createdList = await Listing.create(listData);
    res.redirect("/listings")
}

const listListing = async (req, res) => {
    let allList = await Listing.find().populate("owner")

    res.render("listings/index.ejs", { allList });
}

const listingDetails = async (req, res) => {
    let list = await Listing.findById(req.params.Id).populate("owner").populate("questions.author");

    const userHasFavorited = list.favoritedByUsers.some(user => {
        return user.equals(req.session.user.id)
    });

    res.render("listings/show.ejs", {
        list,
        userHasFavorited
    });
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

    if (req.file) {
        let uploadedImage = await uploadImage(req.file.buffer);
        req.body.image = {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id
        }
    }

    await Listing.findByIdAndUpdate(req.params.Id, req.body)
    res.redirect(`/listings/${req.params.Id}`)
}

const favorite = async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.listingId, {
        $push: { favoritedByUsers: req.params.userId }
    });

    res.redirect(`/listings/${req.params.listingId}`)
}

const unfavorite = async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.listingId, {
        $pull: { favoritedByUsers: req.params.userId }
    });

    res.redirect(`/listings/${req.params.listingId}`)
}

module.exports = {
    showNewForm,
    createList,
    listListing,
    listingDetails,
    deleteListing,
    showEditListing,
    editListing,
    favorite,
    unfavorite,
}
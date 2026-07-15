const User = require("../models/user");
const bcrypt = require("bcrypt");

const home = (req, res) => {
    res.render("home.ejs");
};

// Add the complete sign-up logic when you create the sign-up form.
const signUp = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Example:
    // await User.create({
    //     username: req.body.username,
    //     password: hashedPassword,
    // });

    // Add a redirect or response later.
};

module.exports = {
    home,
    signUp,
};

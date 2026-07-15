const User = require("../models/user");
const bcrypt = require("bcrypt");

const home = (req, res) => {
    res.render("home.ejs", {
        user: req.session.user,
    });
}

const showSignUpForm = (req, res) => {
    res.render("auth/sign-up.ejs", {
        user: req.session.user,
    });
}

const signUp = async (req, res) => {
    const userInDatabase = await User.findOne({
        username: req.body.username
    });

    if (userInDatabase) return res.send("Username is already taken");

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    let userData = {
        username: req.body.username,
        password: hashedPassword
    }

    const user = await User.create(userData);
    
    req.session.user = {
        username: user.username,
        id: user.id,
    }

    req.session.save(() => {
        res.redirect("/");
    });
}

const showSignInForm = (req, res) => {
    res.render("auth/sign-in.ejs", {
        user: req.session.user,
    });
}

const signIn = async (req, res) => {
    const userInDatabase = await User.findOne({
        username: req.body.username
    });

    if (!userInDatabase) return res.send("User does not exist");

    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);

    if (!validPassword) return res.send("Login failed");

    req.session.user = {
        username: userInDatabase.username,
        id: userInDatabase.id,
    }

    req.session.save(() => {
        res.redirect("/");
    });
}

const signOut = async (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
}

module.exports = {
    home,
    showSignUpForm,
    signUp,
    showSignInForm,
    signIn,
    signOut,
}
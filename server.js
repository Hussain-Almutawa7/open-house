const dns = require("node:dns");

// DNS workaround for MongoDB Atlas.
// Remove these two lines if your regular DNS works correctly.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const authCtrl = require("./controllers/auth.js");
const listingCtrl = require("./controllers/listing-controller.js")

// Custom MiddleWare
const isSignedIn = require("./middleware/is-signed-in.js")
const passUserToView = require("./middleware/pass-user-to-view.js")

const methodOverride = require("method-override");
const { MongoStore } = require("connect-mongo");
const session = require("express-session");
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        }),
    })
);

app.use(passUserToView)

// AUTH ROUTERS
app.get("/", authCtrl.home);
app.get("/auth/sign-up", authCtrl.showSignUpForm);
app.post("/auth/sign-up", authCtrl.signUp);
app.get("/auth/sign-in", authCtrl.showSignInForm);
app.post("/auth/sign-in", authCtrl.signIn);
app.delete("/auth/sign-out", authCtrl.signOut);

// LISTING ROUTER
app.get("/listings/new", isSignedIn, listingCtrl.showNewForm);
app.post("/listings", listingCtrl.createList);
app.get("/listings", listingCtrl.listListing);
app.get("/listings/:Id", isSignedIn, listingCtrl.listingDetails)
app.delete("/listings/:Id", isSignedIn, listingCtrl.deleteListing)

app.get("/listings/:Id/edit", isSignedIn, listingCtrl.showEditListing)
app.put("/listings/:Id", isSignedIn, listingCtrl.editListing)

app.get("/dashboard", isSignedIn, async (req, res) => {
    res.render("dashboard.ejs");
});

app.get("/*splat", (req, res) => {
    res.render("erroe.ejs", {
        msg: 404
    });
});


const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log(`Connected to MongoDB: ${mongoose.connection.name}`);

        app.listen(PORT, () => {
            console.log(`Listening on ${PORT}`);
        });
    } catch (error) {
        console.log("MongoDB connection error:", error.message);
    }
};

startServer();

const dns = require("node:dns");

// DNS workaround for MongoDB Atlas.
// Remove these two lines if your regular DNS works correctly.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const authCtrl = require("./controllers/auth.js");
const methodOverride = require("method-override");
const { MongoStore } = require("connect-mongo");
const session = require("express-session");
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000; // For me, this is best practice. Usually, the port is placed in .env; if not, 3000 will be used

// Set ejs by default example: res.render("home") inseatd of res.render("home.ejs")
// Delete it if you find it confusing; nothing will be changed
app.set("view engine", "ejs");

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

app.get("/", authCtrl.home);

// Add authentication routes later, for example:
// app.get("/auth/sign-up", authCtrl.showSignUpForm);
// app.post("/auth/sign-up", authCtrl.signUp);
// app.get("/auth/sign-in", authCtrl.showSignInForm);
// app.post("/auth/sign-in", authCtrl.signIn);
// app.delete("/auth/sign-out", authCtrl.signOut);

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

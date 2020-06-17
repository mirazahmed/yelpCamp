const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash    = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user");
    // seedDB = require("./seeds");

    //load the environment variable file
    require('dotenv').config({path:"./config/keys.env"});

    //requring routes
const commentRoutes    = require("./routes/comments"),
campgroundRoutes = require("./routes/campgrounds"),
indexRoutes      = require("./routes/index")

const url = process.env.MONGODB_CONNECTION_STING || "mongodb://localhost:27017/yelp_camp" ;

mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

 
const port = 3000;

app.listen(port,()=>{
    console.log("The YelpCamp Server has started");
});
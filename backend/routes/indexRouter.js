const { Router } = require('express')
const passport = require("passport");
const { signup, login, logout, getMe } = require("../controllers/authController");
const { newPost, getFeed } = require("../controllers/postController")
const indexRouter = Router();

indexRouter.post("/signup", signup);
indexRouter.post( "/login", passport.authenticate("local"), login );
indexRouter.post("/logout", logout);
indexRouter.get("/me", getMe);

indexRouter.get("/posts/", getFeed);
indexRouter.post("/posts/", newPost);

indexRouter.get("/", (req, res) => {res.json("Hello, world!")});

module.exports = indexRouter;
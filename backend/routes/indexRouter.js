const { Router } = require('express')
const passport = require("passport");
const { signup, login, logout, getMe } = require("../controllers/authController");
const { newPost, getFeed } = require("../controllers/postController")
const { getUsers, followUser, unfollowUser } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");
const indexRouter = Router();

indexRouter.post("/signup", signup);
indexRouter.post( "/login", passport.authenticate("local"), login );
indexRouter.post("/logout", logout);
indexRouter.get("/me", requireAuth, getMe);

indexRouter.get("/posts/", requireAuth, getFeed);
indexRouter.post("/posts/", requireAuth, newPost);

indexRouter.get("/users", requireAuth, getUsers);
indexRouter.post("/users/:id/follow", requireAuth, followUser);
indexRouter.delete("/users/:id/follow", requireAuth, unfollowUser);

indexRouter.get("/", (req, res) => {res.json("Hello, world!")});

module.exports = indexRouter;
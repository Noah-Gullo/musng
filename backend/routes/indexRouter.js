const { Router } = require('express')
const passport = require("passport");
const { signup, login, logout, getMe } = require("../controllers/authController");
const { newPost, getFeed, likePost, unlikePost, newComment } = require("../controllers/postController")
const { getUsers, followUser, unfollowUser, getProfile, updateProfile } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");
const indexRouter = Router();

indexRouter.post("/signup", signup);
indexRouter.post( "/login", passport.authenticate("local"), login );
indexRouter.post("/logout", logout);
indexRouter.get("/me", requireAuth, getMe);
indexRouter.put("/me/profile", requireAuth, updateProfile);

indexRouter.get("/posts/", requireAuth, getFeed);
indexRouter.post("/posts/", requireAuth, newPost);
indexRouter.post("/posts/:id/like", requireAuth,likePost);
indexRouter.delete("/posts/:id/like", requireAuth,unlikePost);
indexRouter.post("/posts/:id/comments",requireAuth,newComment);

indexRouter.get("/users", getUsers);
indexRouter.get("/users/:id", requireAuth, getProfile);
indexRouter.post("/users/:id/follow", requireAuth, followUser);
indexRouter.delete("/users/:id/follow", requireAuth, unfollowUser);

module.exports = indexRouter;
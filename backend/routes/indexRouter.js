const { Router } = require('express')
const indexRouter = Router();

indexRouter.post("/signup", signup);
indexRouter.post( "/login", passport.authenticate("local"), login );
indexRouter.post("/logout", logout);

indexRouter.get("/", (req, res) => {res.json("Hello, world!")});

module.exports = indexRouter;
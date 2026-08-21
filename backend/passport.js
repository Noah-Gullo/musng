const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const prisma = require("./db/prisma");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        return done(null, false, {
          message: "Incorrect username",
        });
      }

      const passwordMatches = await bcrypt.compare(
        password,
        user.passwordHash
      );

      if (!passwordMatches) {
        return done(null, false, {
          message: "Incorrect password",
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
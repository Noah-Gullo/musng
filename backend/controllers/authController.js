const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const prisma = require("../db/prisma");

function getGravatarUrl(email) {
  const hash = crypto
    .createHash("md5")
    .update(email.trim().toLowerCase())
    .digest("hex");

  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
}

async function signup(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        profilePhoto: getGravatarUrl(email),
      },
    });

    req.login(user, (error) => {
      if (error) {
        return next(error);
      }

      return res.status(201).json({
        message: "Account created",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          bio: user.bio,
          profilePhoto: user.profilePhoto,
        },
      });
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Could not create account",
    });
  }
}

function login(req, res) {
  return res.status(200).json({
    message: "Login successful",
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      displayName: req.user.displayName,
      bio: req.user.bio,
      profilePhoto: req.user.profilePhoto,
    },
  });
}

function logout(req, res, next) {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }

      res.clearCookie("connect.sid");

      return res.status(200).json({
        message: "Logout successful",
      });
    });
  });
}

function getMe(req, res) {
  if (!req.user) {
    return res.status(200).json({
      user: null,
    });
  }

  return res.status(200).json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      displayName: req.user.displayName,
      bio: req.user.bio,
      profilePhoto: req.user.profilePhoto,
    },
  });
}


module.exports = {
  signup,
  login,
  logout,
  getMe,
};
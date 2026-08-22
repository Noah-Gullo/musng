const prisma = require("../db/prisma");

async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: req.user.id,
        },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        profilePhoto: true,
        followers: {
          where: {
            followerId: req.user.id,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        username: "asc",
      },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      profilePhoto: user.profilePhoto,
      isFollowing: user.followers.length > 0,
    }));

    return res.status(200).json({
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      message: "Could not load users",
    });
  }
}

async function followUser(req, res) {
  try {
    const followingId = Number(req.params.id);

    if (followingId === req.user.id) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: followingId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user.id,
          followingId,
        },
      },
    });

    if (existingFollow) {
      return res.status(409).json({
        message: "Already following user",
      });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: req.user.id,
        followingId,
      },
    });

    return res.status(201).json({
      message: "User followed",
      follow,
    });
  } catch (error) {
    console.error("Follow user error:", error);

    return res.status(500).json({
      message: "Could not follow user",
    });
  }
}

async function unfollowUser(req, res) {
  try {
    const followingId = Number(req.params.id);

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user.id,
          followingId,
        },
      },
    });

    if (!existingFollow) {
      return res.status(404).json({
        message: "You are not following this user",
      });
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: req.user.id,
          followingId,
        },
      },
    });

    return res.status(200).json({
      message: "User unfollowed",
    });
  } catch (error) {
    console.error("Unfollow user error:", error);

    return res.status(500).json({
      message: "Could not unfollow user",
    });
  }
}

async function getProfile(req, res) {
  try {
    const userId = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        profilePhoto: true,
        posts: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                profilePhoto: true,
              },
            },
            likes: true,
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Could not load profile",
    });
  }
}

module.exports = {
  getUsers,
  followUser,
  unfollowUser,
  getProfile
};
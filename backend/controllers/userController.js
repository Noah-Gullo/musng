const prisma = require("../db/prisma");

async function getUsers(req, res) {
  try {
    const currentUserId = req.user?.id;

    const users = await prisma.user.findMany({
      where: currentUserId
        ? {
            id: {
              not: currentUserId,
            },
          }
        : {},
      select: {
        id: true,
        username: true,
        displayName: true,
        profilePhoto: true,
        followers: {
          where: currentUserId
            ? {
                followerId: currentUserId,
              }
            : {
                followerId: -1,
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
      isFollowing: currentUserId
        ? user.followers.length > 0
        : false,
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

    if (!Number.isInteger(followingId)) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

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

    if (!Number.isInteger(followingId)) {
      return res.status(400).json({
        message: "Invalid user id",
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
    const currentUserId = req.user?.id;

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

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
        followers: {
          where: currentUserId
            ? {
                followerId: currentUserId,
              }
            : {
                followerId: -1,
              },
          select: {
            id: true,
          },
        },
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

    const formattedUser = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      profilePhoto: user.profilePhoto,
      posts: user.posts,
      isFollowing: currentUserId
        ? user.followers.length > 0
        : false,
    };

    return res.status(200).json({
      user: formattedUser,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Could not load profile",
    });
  }
}

async function updateProfile(req, res) {
  try {
    const { displayName, bio, profilePhoto } = req.body;

    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        displayName: displayName?.trim() || null,
        bio: bio?.trim() || null,
        profilePhoto: profilePhoto?.trim() || null,
      },
    });

    return res.status(200).json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Could not update profile",
    });
  }
}

module.exports = {
  getUsers,
  followUser,
  unfollowUser,
  getProfile,
  updateProfile,
};
const prisma = require("../db/prisma");

async function getFeed(req, res) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            authorId: req.user.id,
          },
          {
            author: {
              followers: {
                some: {
                  followerId: req.user.id,
                },
              },
            },
          },
        ],
      },
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
    });

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error("Get feed error:", error);

    return res.status(500).json({
      message: "Could not load posts",
    });
  }
}

async function newPost(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Post cannot be empty",
      });
    }

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        authorId: req.user.id,
      },
    });

    return res.status(201).json({
      message: "Post created",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error);

    return res.status(500).json({
      message: "Could not create post",
    });
  }
}

module.exports = {
  newPost,
  getFeed
};
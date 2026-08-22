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

async function likePost(req, res) {
  try {
    const postId = Number(req.params.id);

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId,
        },
      },
    });

    if (existingLike) {
      return res.status(409).json({
        message: "Post already liked",
      });
    }

    await prisma.like.create({
      data: {
        userId: req.user.id,
        postId,
      },
    });

    return res.status(201).json({
      message: "Post liked",
    });
  } catch (error) {
    console.error("Like post error:", error);

    return res.status(500).json({
      message: "Could not like post",
    });
  }
}

async function unlikePost(req, res) {
  try {
    const postId = Number(req.params.id);

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId,
        },
      },
    });

    if (!existingLike) {
      return res.status(404).json({
        message: "Like not found",
      });
    }

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId,
        },
      },
    });

    return res.status(200).json({
      message: "Post unliked",
    });
  } catch (error) {
    console.error("Unlike post error:", error);

    return res.status(500).json({
      message: "Could not unlike post",
    });
  }
}

async function newComment(req, res) {
  try {
    const postId = Number(req.params.id);
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: req.user.id,
        postId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Comment created",
      comment,
    });
  } catch (error) {
    console.error("Create comment error:", error);

    return res.status(500).json({
      message: "Could not create comment",
    });
  }
}

module.exports = {
  newPost,
  getFeed,
  likePost,
  unlikePost,
  newComment
};
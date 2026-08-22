import { useState } from "react";

function Post({ post, userId }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState("");

  const liked = likes.some(
    (like) => like.userId === userId
  );

  async function handleLike() {
    try {
      setError("");

      const response = await fetch(
        `http://localhost:3000/api/posts/${post.id}/like`,
        {
          method: liked ? "DELETE" : "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        setError("Could not update like");
        return;
      }

      if (liked) {
        setLikes((currentLikes) =>
          currentLikes.filter(
            (like) => like.userId !== userId
          )
        );
      } else {
        setLikes((currentLikes) => [
          ...currentLikes,
          {
            userId,
            postId: post.id,
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      setError("Could not update like");
    }
  }

  async function handleComment(event) {
    event.preventDefault();

    if (!commentContent.trim()) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `http://localhost:3000/api/posts/${post.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            content: commentContent,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not add comment");
        return;
      }

      setComments((currentComments) => [
        ...currentComments,
        data.comment,
      ]);

      setCommentContent("");
    } catch (error) {
      console.error(error);
      setError("Could not add comment");
    }
  }

  return (
    <article className="post-card">
      <h3>
        {post.author.displayName || post.author.username}
      </h3>

      <p className="post-content">
        {post.content}
      </p>

      <div className="post-actions">
        <button type="button" onClick={handleLike}>
          {liked ? "Unlike" : "Like"}
        </button>

        <span>
          {likes.length} {likes.length === 1 ? "like" : "likes"}
        </span>

        <button type="button"onClick={() => setShowComments(!showComments)}>
          {showComments ? "Hide Comments" : "Comments"} (
          {comments.length})
        </button>
      </div>

      {error && <p>{error}</p>}

      {showComments && (
        <div className="comments">
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <p key={comment.id}>
                <strong>
                  {comment.author.displayName ||
                    comment.author.username}
                </strong>{" "}
                {comment.content}
              </p>
            ))
          )}

          <form onSubmit={handleComment}>
            <input
              type="text"
              value={commentContent}
              onChange={(event) =>
                setCommentContent(event.target.value)
              }
              placeholder="Write a comment..."
              required
            />

            <button type="submit">
              Comment
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

export default Post;
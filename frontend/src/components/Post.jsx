import { useState } from "react";

function Post({ post, userId }) {
  const [likes, setLikes] = useState(post.likes);
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
        const data = await response.json();
        setError(data.message || "Could not update like");
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

  return (
    <article className="post-card">
      <h3>
        {post.author.displayName || post.author.username}
      </h3>

      <p className="post-content">
        {post.content}
      </p>

      <button onClick={handleLike}>
        {liked ? "Unlike" : "Like"}
      </button>

      <span>
        {" "}
        {likes.length} {likes.length === 1 ? "like" : "likes"}
      </span>

      {error && <p>{error}</p>}

      <div className="comments">
        {post.comments.map((comment) => (
          <p key={comment.id}>
            <strong>{comment.author.username}</strong>{" "}
            {comment.content}
          </p>
        ))}
      </div>
    </article>
  );
}

export default Post;
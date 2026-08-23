import { useState } from "react";
import { Link } from "react-router-dom";

function Post({ post, userId }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [animateEcho, setAnimateEcho] = useState(false);
  const [echoDirection, setEchoDirection] = useState("");
  const [error, setError] = useState("");

  const liked = likes.some((like) => like.userId === userId);

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
        setError("Could not update echo");
        return;
      }

      if (liked) {
        setLikes((currentLikes) =>
          currentLikes.filter((like) => like.userId !== userId)
        );

        setEchoDirection("down");
      } else {
        setLikes((currentLikes) => [
          ...currentLikes,
          {
            userId,
            postId: post.id,
          },
        ]);

        setEchoDirection("up");
      }

      setAnimateEcho(false);

      requestAnimationFrame(() => {
        setAnimateEcho(true);
      });
    } catch (error) {
      console.error(error);
      setError("Could not update echo");
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
        setError(data.message || "Could not add reply");
        return;
      }

      setComments((currentComments) => [
        ...currentComments,
        data.comment,
      ]);

      setCommentContent("");
    } catch (error) {
      console.error(error);
      setError("Could not add reply");
    }
  }

  return (
    <article className="post-card">
      <div className="post-author">
        <Link to={`/users/${post.author.id}`} className="post-author-link">
          <strong>{post.author.displayName || post.author.username}</strong>
          <span>@{post.author.username}</span>
        </Link>
      </div>

      <p className="post-content">{post.content}</p>

      <div className="post-actions">
        <div className={`like-container ${liked ? "liked" : ""}`}>
          <button type="button" className={`like-button ${liked ? "liked" : ""}`} onClick={handleLike} aria-label={liked ? "Remove echo" : "Echo this musng"}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.1 21.2C10.7 19.9 4.2 14.4 2.8 10.8C1.4 7.2 3.4 4.2 6.7 4.2C9 4.2 10.7 5.6 12 7.3C13.2 5.6 14.9 4.2 17.2 4.2C20.6 4.2 22.5 7.3 21.1 10.8C19.7 14.2 14.7 18.7 12.1 21.2Z" />
            </svg>
          </button>

          <span className="spark spark-1"></span>
          <span className="spark spark-2"></span>
          <span className="spark spark-3"></span>
          <span className="spark spark-4"></span>
          <span className="spark spark-5"></span>
          <span className="spark spark-6"></span>
          <span className="spark spark-7"></span>
          <span className="spark spark-8"></span>
        </div>

        <span className="echo-count">
          <span
            className={`echo-number ${
              animateEcho ? `echo-${echoDirection}` : ""
            }`}
            onAnimationEnd={() => setAnimateEcho(false)}
          >
            {likes.length}
          </span>

          <span>{likes.length === 1 ? "echo" : "echoes"}</span>
        </span>

        <button className="replies-button" type="button" onClick={() => setShowComments(!showComments)}>
          {showComments ? "Hide Replies" : "Replies"} ({comments.length})
        </button>
      </div>

      {error && <p>{error}</p>}

      {showComments && (
        <div className="comments">
          {comments.length === 0 ? (
            <p>No replies yet.</p>
          ) : (
            comments.map((comment) => (
              <p key={comment.id}>
                <Link to={`/users/${comment.author.id}`} className="comment-author-link">
                  <strong>{comment.author.displayName || comment.author.username}</strong>{" "}
                  <span>@{comment.author.username}</span>
                </Link>{" "}
                {comment.content}
              </p>
            ))
          )}

          <form onSubmit={handleComment}>
            <input type="text" value={commentContent} onChange={(event) => setCommentContent(event.target.value)} placeholder="Add a reply..." required />
            <button type="submit">Reply</button>
          </form>
        </div>
      )}
    </article>
  );
}

export default Post;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"

function NewPost() {
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!content.trim()) {
      setError("Post cannot be empty");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            content,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not create post");
        return;
      }

      navigate("/");
    } catch (error) {
      console.error("Could not create post:", error);
      setError("Could not connect to server");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="new-post-page">
      <Navbar></Navbar>
      <section className="new-post-card">
        <h1>New Post</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="content">Post</label>

            <textarea
              id="content"
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              placeholder="What's on your mind?"
              rows="6"
              maxLength={500}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Create Post"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default NewPost;
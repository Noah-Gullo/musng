import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Post from "../components/Post";

function GuestFeed() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch("http://localhost:3000/api/posts", {
          credentials: "include",
        });

        if (!response.ok) {
          setError("Could not load musngs");
          return;
        }

        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error(error);
        setError("Could not connect to server");
      }
    }

    loadPosts();
  }, []);

  return (
    <main className="guest-page">
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </nav>

      <section className="feed">
        <h1>Recent Musngs</h1>

        {error && <p>{error}</p>}

        {posts.length === 0 ? (
          <p>No musngs yet.</p>
        ) : (
          posts.map((post) => (
            <Post key={post.id} post={post} userId={undefined} />
          ))
        )}
      </section>
    </main>
  );
}

export default GuestFeed;
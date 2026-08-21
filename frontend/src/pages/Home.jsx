import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Logout from "../components/Logout";
import Post from "../components/Post";

function Home() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHome() {
      try {
        const userResponse = await fetch(
          "http://localhost:3000/api/me",
          {
            credentials: "include",
          }
        );

        if (userResponse.status === 401) {
          setUser(null);
          setLoading(false);
          return;
        }

        if (!userResponse.ok) {
          setError("Could not check session");
          return;
        }

        const userData = await userResponse.json();
        setUser(userData.user);

        const postsResponse = await fetch(
          "http://localhost:3000/api/posts",
          {
            credentials: "include",
          }
        );

        if (!postsResponse.ok) {
          setError("Could not load posts");
          return;
        }

        const postsData = await postsResponse.json();
        setPosts(postsData.posts);
      } catch (error) {
        console.error(error);
        setError("Could not connect to server");
      } finally {
        setLoading(false);
      }
    }

    loadHome();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="home-page">
      {!user ? (
        <section className="home-content">
          <h1>Musng</h1>

          <p>Sign in or create an account to continue.</p>

          <div className="home-actions">
            <Link to="/login" className="home-primary-button">
              Login
            </Link>

            <Link to="/signup" className="home-secondary-button">
              Signup
            </Link>
          </div>
        </section>
      ) : (
        <section className="feed">
          <Navbar></Navbar>
          <h1>
            Welcome, {user.displayName || user.username}!
          </h1>

          <h2>Recent Posts</h2>

          {error && <p>{error}</p>}

          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            posts.map((post) => (
              <Post key={post.id} post={post} userId={user.id}/>
            ))
          )}
          <Logout onLogout={() => setUser(null)} />
        </section>
      )}
    </main>
  );
}

export default Home;
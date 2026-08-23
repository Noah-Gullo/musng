import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Users() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const meResponse = await fetch(`${API_URL}/api/me`, {
          credentials: "include",
        });

        if (meResponse.ok) {
          const meData = await meResponse.json();
          setCurrentUser(meData.user);
        }

        const response = await fetch(`${API_URL}/api/users`, {
          credentials: "include",
        });

        if (!response.ok) {
          setError("Could not load users");
          return;
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error(error);
        setError("Could not connect to server");
      }
    }

    loadUsers();
  }, []);

  async function handleFollow(userId, isFollowing) {
    try {
      setError("");

      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${API_URL}api/users/${userId}/follow`,
        {
          method: isFollowing ? "DELETE" : "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Could not update follow");
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                isFollowing: !user.isFollowing,
              }
            : user
        )
      );
    } catch (error) {
      console.error(error);
      setError("Could not connect to server");
    }
  }

  return (
    <main className="users-page">
      <Navbar user={currentUser} />

      <h1>Users</h1>

      {error && <p>{error}</p>}

      <section className="users-list">
        {users.map((user) => (
          <article key={user.id} className="user-card">
            <Link to={`/users/${user.id}`}>
              {user.profilePhoto && (
                <img
                  src={user.profilePhoto}
                  alt={`@${user.username}'s profile`}
                  className="profile-photo"
                />
              )}
            </Link>

            <div className="user-info">
              <Link to={`/users/${user.id}`}>
                <h2>{user.displayName || user.username}</h2>
              </Link>

              <p>@{user.username}</p>
            </div>

            {currentUser && (
              <button type="button" onClick={() => handleFollow(user.id, user.isFollowing)}>
                {user.isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

export default Users;
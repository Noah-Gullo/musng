import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users",
          {
            credentials: "include",
          }
        );

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

    getUsers();
  }, []);

  async function handleFollow(userId, isFollowing) {
    try {
      setError("");

      const response = await fetch(
        `http://localhost:3000/api/users/${userId}/follow`,
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
      <Navbar></Navbar>
      <h1>Users</h1>

      {error && <p>{error}</p>}

      <section className="users-list">
        {users.map((user) => (
          <article key={user.id} className="user-card">
            <h2>
              {user.displayName || user.username}
            </h2>

            <p>@{user.username}</p>

            <button
              onClick={() =>
                handleFollow(user.id, user.isFollowing)
              }
            >
              {user.isFollowing ? "Following" : "Follow"}
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Users;
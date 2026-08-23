import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import Navbar from "../components/Navbar";

function Profile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const meResponse = await fetch(
          "http://localhost:3000/api/me",
          {
            credentials: "include",
          }
        );

        if (!meResponse.ok) {
          setError("Could not load user");
          return;
        }

        const meData = await meResponse.json();
        setCurrentUser(meData.user);

        const profileId = id || meData.user.id;

        const profileResponse = await fetch(
          `http://localhost:3000/api/users/${profileId}`,
          {
            credentials: "include",
          }
        );

        if (!profileResponse.ok) {
          setError("Could not load profile");
          return;
        }

        const profileData = await profileResponse.json();

        setUser(profileData.user);
        setDisplayName(profileData.user.displayName || "");
        setBio(profileData.user.bio || "");
        setProfilePhoto(profileData.user.profilePhoto || "");
      } catch (error) {
        console.error(error);
        setError("Could not connect to server");
      }
    }

    loadProfile();
  }, [id]);

  async function handleUpdate(event) {
    event.preventDefault();

    try {
      setError("");

      const response = await fetch(
        "http://localhost:3000/api/me/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            displayName,
            bio,
            profilePhoto,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not update profile");
        return;
      }

      setUser((currentUser) => ({
        ...currentUser,
        displayName: data.user.displayName,
        bio: data.user.bio,
        profilePhoto: data.user.profilePhoto,
      }));

      setEditing(false);
    } catch (error) {
      console.error(error);
      setError("Could not update profile");
    }
  }

  function handleCancel() {
    setDisplayName(user.displayName || "");
    setBio(user.bio || "");
    setProfilePhoto(user.profilePhoto || "");
    setEditing(false);
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user || !currentUser) {
    return <p>Loading...</p>;
  }

  const isOwnProfile = user.id === currentUser.id;

  return (
    <main className="profile-page">
      <Navbar />

      <section className="profile-header">
        {editing ? (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="displayName">
                Display Name
              </label>

              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(event) =>
                  setDisplayName(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">
                Bio
              </label>

              <textarea
                id="bio"
                value={bio}
                onChange={(event) =>
                  setBio(event.target.value)
                }
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="profilePhoto">
                Profile Photo URL
              </label>

              <input
                id="profilePhoto"
                type="url"
                value={profilePhoto}
                onChange={(event) =>
                  setProfilePhoto(event.target.value)
                }
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            {profilePhoto && (
              <img
                src={profilePhoto}
                alt="Profile preview"
                className="profile-photo"
              />
            )}

            <button type="submit">
              Save
            </button>

            <button
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            {user.profilePhoto && (
              <img
                src={user.profilePhoto}
                alt={`${user.username}'s profile`}
                className="profile-photo"
              />
            )}

            <h1>
              {user.displayName || user.username}
            </h1>

            <p>@{user.username}</p>

            {user.bio && <p>{user.bio}</p>}

            {isOwnProfile && (
              <button
                type="button"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </>
        )}
      </section>

      <section className="profile-posts">
        <h2>Posts</h2>

        {user.posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          user.posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              userId={currentUser.id}
            />
          ))
        )}
      </section>
    </main>
  );
}

export default Profile;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Could not create account"
        );
        return;
      }

      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
      setError("Could not connect to server");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <h1>Create Account</h1>
          <p>Join Musng and start messaging.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username: </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email: </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password: </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Choose a password"
              required
            />
          </div>

          {error && (
            <p className="auth-error">{error}</p>
          )}

          <button type="submit"className="auth-button">Signup</button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

        <Link to="/" className="auth-home-link">
          Back to Home
        </Link>
      </section>
    </main>
  );
}

export default Signup;
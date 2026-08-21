import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (!response.ok) {
        setError("Invalid username or password");
        return;
      }

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Could not connect to server");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <h1>Login</h1>
          <p>Welcome back to Musng.</p>
        </header>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="username"> Username: </label>

            <input id="username" type="text" value={username} onChange={(event) =>  
              setUsername(event.target.value)
              } placeholder="Enter your username"required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password: </label>

            <input id="password" type="password" value={password} onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p className="auth-error">{error}</p>
          )}

          <button type="submit" className="auth-button">Login</button>
        </form>

        <p className="auth-footer"> 
          Don't have an account?{" "}
          <Link to="/signup"> Sign Up</Link>
        </p>

        <Link to="/">Back to Home</Link>
      </section>
    </main>
  );
}

export default Login;
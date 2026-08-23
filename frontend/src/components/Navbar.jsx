import { Link } from "react-router-dom";
import Logout from "./Logout";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>

      {user ? (
        <>
          <Link to="/posts/new">New Musng</Link>
          <Link to="/users">Users</Link>
          <Link to="/profile">Profile</Link>
          <Logout onLogout={onLogout} />
        </>
      ) : (
        <>
          <Link to="/users">Users</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
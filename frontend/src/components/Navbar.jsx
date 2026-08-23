import { Link } from "react-router-dom";
import Logout from "./Logout";

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/posts/new">New Musng</Link>
      <Link to="/users">Users</Link>
      <Link to="/profile">Profile</Link>

      <Logout onLogout={onLogout} />
    </nav>
  );
}

export default Navbar;
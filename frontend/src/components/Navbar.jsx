import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/posts/new">New Post</Link>
      <Link to="/users">Users</Link>
    </nav>
  );
}

export default Navbar;
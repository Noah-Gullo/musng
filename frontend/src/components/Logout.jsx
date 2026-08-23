import { useNavigate } from "react-router-dom";

function Logout({ onLogout }) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Logout failed");
        return;
      }

      if (onLogout) {
        onLogout();
      }

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <button type="button" id="logoutBtn" className="navbar-link" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;
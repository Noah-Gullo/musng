import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(
          `${API_URL}/api/me`,
          {
            credentials: "include",
          }
        );

        setAuthenticated(response.ok);
      } catch (error) {
        console.error(error);
        setAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  if (authenticated === null) {
    return <p>Loading...</p>;
  }

  if (!authenticated) {
    return <Navigate to="/signup" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
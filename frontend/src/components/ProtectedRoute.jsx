import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/me",
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
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;